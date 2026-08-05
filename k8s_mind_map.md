Here is how every component in a Kubernetes cluster connects to every other component, organized visually and mapped across real-world operational scenarios.

---

## 1. Kubernetes Component Mind Map

All components talk **exclusively through the API Server**. No worker node or control plane component writes directly to another component or to `etcd` directly.

```
                     ┌────────────────────────────────────────────────────────┐
                     │                       USER / CI-CD                     │
                     └───────────────────────────┬────────────────────────────┘
                                                 │ (kubectl / Helm / API)
                                                 ▼
┌─────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                             CONTROL PLANE                                               │
│                                                                                                         │
│   ┌────────────────────┐          ┌──────────────────────┐          ┌──────────────────────────────┐    │
│   │   kube-scheduler   ├─────────►│                      │◄─────────┤   kube-controller-manager    │    │
│   │                    │          │                      │          │  (Node, Replica, Deployment) │    │
│   │  (Decides node)    │          │                      │          └──────────────────────────────┘    │
│   └────────────────────┘          │   kube-apiserver     │                                          │
│                                   │                      │          ┌──────────────────────────────┐    │
│                                   │   (The Central Hub)  │◄─────────┤  cloud-controller-manager    │    │
│                                   │                      │          │  (AWS/GCP Load Balancers)    │    │
│                                   └──────────┬───▲───────┘          └──────────────────────────────┘    │
│                                              │   │                                                      │
│                                              ▼   │                                                      │
│                                   ┌──────────────────────┐                                              │
│                                   │        etcd          │                                              │
│                                   │  (Single Source of   │                                              │
│                                   │    Truth DB)         │                                              │
│                                   └──────────────────────┘                                              │
└──────────────────────────────────────────────┬──────────────────────────────────────────────────────────┘
                                               │ (HTTPS / gRPC)
                       ┌───────────────────────┴───────────────────────┐
                       ▼                                               ▼
┌──────────────────────────────────────────────┐ ┌──────────────────────────────────────────────┐
│                WORKER NODE 1                 │ │                WORKER NODE 2                 │
│                                              │ │                                              │
│  ┌───────────┐  ┌───────────┐  ┌──────────┐ │ │  ┌───────────┐  ┌───────────┐  ┌──────────┐ │
│  │  kubelet  │  │kube-proxy │  │Container │ │ │  │  kubelet  │  │kube-proxy │  │Container │ │
│  │ (Agent)   │  │ (Network) │  │ Runtime  │ │ │  │ (Agent)   │  │ (Network) │  │ Runtime  │ │
│  └─────┬─────┘  └─────┬─────┘  └────┬─────┘ │ │  └─────┬─────┘  └─────┬─────┘  └────┬─────┘ │
│        │              │             │        │ │        │              │             │        │
│        ▼              ▼             ▼        │ │        ▼              ▼             ▼        │
│  ┌────────────────────────────────────────┐  │ │  ┌────────────────────────────────────────┐  │
│  │  POD 1 (App Container + IP: 10.244.1.2)│  │ │  │  POD 2 (App Container + IP: 10.244.2.4)│  │
│  └────────────────────────────────────────┘  │ │  └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘ └──────────────────────────────────────────────┘

```

---

## 2. Component-by-Component Responsibilities

### The Control Plane (Brain)

* **`kube-apiserver`:** The gatekeeper. Authenticates the user/system, validates schemas, executes admission controllers, and reads/writes to `etcd`.
* **`etcd`:** Distributed key-value store holding cluster state. If it's not in `etcd`, it doesn't exist in the cluster.
* **`kube-scheduler`:** Watches `kube-apiserver` for new Pods without an assigned node. Evaluates CPU/RAM requirements, node taints, and affinity rules to pick the best node.
* **`kube-controller-manager`:** Runs reconciliation loops (e.g., *DeploymentController*, *NodeController*). Constantly aligns *Actual State* with *Desired State*.
* **`cloud-controller-manager`:** Integrates with underlying cloud providers (AWS, GCP, Azure) to provision resources like external load balancers or cloud storage volumes.

### The Worker Nodes (Muscle)

* **`kubelet`:** The node supervisor agent. Watches `kube-apiserver` for Pod specs assigned to its node and tells the Container Runtime to fetch images and run containers.
* **Container Runtime (`containerd` / `CRI-O`):** Executes low-level container start/stop lifecycle commands sent by `kubelet` via the Container Runtime Interface (CRI).
* **`kube-proxy`:** Maintains host network rules (iptables/IPVS). Enables Service IPs and load-balances internal/external traffic across Pods.
* **CNI Plugin (e.g., Calico, Cilium):** Oversees cluster networking, assigning unique IP addresses to every Pod.

---

## 3. How Components Interact Across Scenarios

### Scenario A: Deploying an Application (`kubectl apply -f deployment.yaml`)

1. **User Request:** You execute `kubectl apply`. The request hits `kube-apiserver`.
2. **Auth & Store:** `kube-apiserver` authenticates you via RBAC, validates the YAML, and saves the spec into `etcd`.
3. **Controller Loop:** The `kube-controller-manager` (specifically the Deployment/ReplicaSet controller) notices a new Deployment in `etcd` via `kube-apiserver`. It creates Pod objects (say, 3 replicas) without node assignments.
4. **Scheduling:** The `kube-scheduler` detects these "unscheduled" Pods. It selects healthy worker nodes (e.g., `Node-2`) and tells `kube-apiserver` to bind Pod 1 to `Node-2`.
5. **Execution:** The `kubelet` running on `Node-2` detects via `kube-apiserver` that a Pod has been assigned to it.
6. **Container Launch:** `kubelet` invokes `containerd` via CRI to pull the Docker image and spin up the container. `kubelet` reports success back to `kube-apiserver`.

---

### Scenario B: A Worker Node Crashes or Hardware Dies

1. **Heartbeat Failure:** The `kubelet` on `Node-1` stops sending heartbeats to `kube-apiserver`.
2. **Detection:** The Node Controller inside `kube-controller-manager` detects `Node-1` is offline (after a timeout like 40s).
3. **Rescheduling:** The `kube-controller-manager` marks the Pods on `Node-1` as `Terminating` or `Unknown` and requests `kube-apiserver` to create replacement Pods.
4. **Placement:** `kube-scheduler` steps in, evaluates remaining active nodes (`Node-2`, `Node-3`), and binds the replacement Pods to them.
5. **Restoration:** `kubelet` instances on those healthy nodes pull images and launch the containers. Total self-healing achieved.

---

### Scenario C: Handling an Incoming Web Request

1. **External Arrival:** Traffic hits an External Cloud Load Balancer provisioned by `cloud-controller-manager`.
2. **Ingress/Proxy Routing:** The Load Balancer forwards traffic to a worker node on a high port (`NodePort`). `kube-proxy` rules evaluate the destination.
3. **Service Discovery:** `kube-proxy` maps the stable **Service IP** to the current real IP of healthy target Pods.
4. **Direct Delivery:** The CNI network layer routes traffic directly into the target container's network namespace inside the Pod.

---

### Scenario D: Auto-Scaling During Traffic Spikes (HPA)

1. **Metrics Gathering:** The `metrics-server` addon gathers CPU/memory usage from every node's `kubelet`.
2. **Scale Decision:** The **Horizontal Pod Autoscaler (HPA)** controller queries `kube-apiserver` for these metrics. If CPU usage crosses 80%, it updates the Deployment's `replicas` field in `etcd` from 3 to 10.
3. **Loop Execution:** `kube-controller-manager` creates 7 new Pod specs $\rightarrow$ `kube-scheduler` places them across nodes $\rightarrow$ `kubelet` instances spin them up $\rightarrow$ `kube-proxy` starts directing traffic to them.
