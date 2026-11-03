#!/usr/bin/env python3
"""Push the combined home batch to main in ONE commit via the GitHub API.
Verifies the server-built tree SHA equals the local combined tree SHA before
moving the main ref. Uses the stored custom.github credential (surrogate)."""
import sys, os, json, base64, subprocess
sys.path.insert(0, "/opt/muse/skills/custom-connector-setup/bin")
from dynamic_credentials import add_surrogate_to_request, read_json_response
import urllib.request, urllib.error

API = "https://api.github.com"
CRED = "custom.github"
HOSTS = ["api.github.com"]
OWNER, REPO = "nabilanjum987", "wch-cites"
WT = os.path.dirname(os.path.abspath(__file__))

def call(method, path, payload=None):
    url = API + path
    data = json.dumps(payload).encode() if payload is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Accept", "application/vnd.github+json")
    req.add_header("X-GitHub-Api-Version", "2022-11-28")
    if data is not None:
        req.add_header("Content-Type", "application/json")
    add_surrogate_to_request(req, CRED, allowed_hosts=HOSTS)
    try:
        with urllib.request.urlopen(req) as resp:
            return resp.status, read_json_response(resp)
    except urllib.error.HTTPError as e:
        return e.code, {"error": e.read().decode("utf-8", "replace")[:500]}

def git(*args, binary=False):
    r = subprocess.run(["git", "-C", WT, *args], capture_output=True)
    if r.returncode != 0:
        print("git failed:", args, r.stderr.decode("utf-8", "replace")[:300]); sys.exit(1)
    return r.stdout if binary else r.stdout.decode().strip()

def main():
    local_tree = git("rev-parse", "HEAD^{tree}")
    st, ref = call("GET", f"/repos/{OWNER}/{REPO}/git/ref/heads/main")
    assert st == 200, (st, ref)
    main_sha = ref["object"]["sha"]
    st, mc = call("GET", f"/repos/{OWNER}/{REPO}/git/commits/{main_sha}")
    assert st == 200, (st, mc)
    main_tree = mc["tree"]["sha"]
    print("main:", main_sha, "tree:", main_tree)
    print("local combined tree:", local_tree)

    out = git("diff", "--name-status", main_sha, "HEAD")
    entries = []
    for line in out.splitlines():
        parts = line.split("\t")
        status, path = parts[0], parts[-1]
        if status.startswith("D"):
            entries.append({"path": path, "mode": "100644", "type": "blob", "sha": None})
            print("DEL", path)
            continue
        mode = git("ls-tree", "HEAD", "--", path).split()[0]
        content = git("show", f"HEAD:{path}", binary=True)
        st, blob = call("POST", f"/repos/{OWNER}/{REPO}/git/blobs",
                        {"content": base64.b64encode(content).decode(), "encoding": "base64"})
        assert st == 201, (path, st, blob)
        entries.append({"path": path, "mode": mode, "type": "blob", "sha": blob["sha"]})
        print("BLOB", path, blob["sha"][:8])
    print("files changed:", len(entries))

    st, tree = call("POST", f"/repos/{OWNER}/{REPO}/git/trees",
                    {"base_tree": main_tree, "tree": entries})
    assert st == 201, (st, tree)
    print("server tree:", tree["sha"])
    if tree["sha"] != local_tree:
        print("TREE MISMATCH — aborting, main untouched"); sys.exit(2)
    print("tree verified identical")

    msg = "Deploy 4 (3 Nov 2026): homepage Iqbal card shows the full portrait contained on a backdrop mat"
    st, commit = call("POST", f"/repos/{OWNER}/{REPO}/git/commits",
                      {"message": msg, "tree": tree["sha"], "parents": [main_sha]})
    assert st == 201, (st, commit)
    print("commit:", commit["sha"])
    st, upd = call("PATCH", f"/repos/{OWNER}/{REPO}/git/refs/heads/main",
                   {"sha": commit["sha"], "force": False})
    assert st == 200, (st, upd)
    print("main now:", upd["object"]["sha"])

if __name__ == "__main__":
    main()
