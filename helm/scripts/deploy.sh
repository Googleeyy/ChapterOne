#!/bin/bash
# Deploy the Library E2E stack using Helm with dependencies.
# Usage: ./deploy.sh [namespace]

set -euo pipefail

NAMESPACE="${1:-library-e2e-dev}"
HELM_DIR="$(cd "$(dirname "$0")/.." && pwd)"
VALUES_FILE="${HELM_DIR}/values.yaml"
RELEASE_NAME="library-e2e"

if [[ ! -f "${VALUES_FILE}" ]]; then
  echo "Missing values file: ${VALUES_FILE}" >&2
  exit 1
fi

echo "Deploying Library E2E to Kubernetes"
echo "Namespace: ${NAMESPACE}"
echo "Helm Chart: ${HELM_DIR}"

echo ""
echo "Step 1: Update Helm dependencies"
cd "${HELM_DIR}"
helm dependency update
echo "Dependencies updated"

echo ""
echo "Step 2: Deploy using Helm"
helm upgrade --install "${RELEASE_NAME}" \
  "${HELM_DIR}" \
  -f "${VALUES_FILE}" \
  --set global.namespace="${NAMESPACE}" \
  --namespace "${NAMESPACE}" \
  --create-namespace \
  --wait --timeout 600s
echo "Deployment complete"

echo ""
echo "Step 4: Wait for MongoDB to be ready"
kubectl wait --for=condition=ready pod -l app=mongodb -n "${NAMESPACE}" --timeout=180s || true
echo "MongoDB status checked"

echo ""
echo "Deployment complete. Current workload status:"
kubectl get pods -n "${NAMESPACE}" -o wide
echo ""
kubectl get svc -n "${NAMESPACE}"
echo ""
echo "Gateway status:"
kubectl get gateway -n "${NAMESPACE}" 2>/dev/null || echo "No gateway found"
