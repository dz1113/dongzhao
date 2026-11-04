---
name: git-push-github
description: 提交并推送当前项目到 GitHub 仓库。当用户要求 commit、push、提交代码到 GitHub 或 dz1113/dongzhao 时触发。不需要额外的 git 配置。
---

# Git Push to GitHub

将当前工作目录的所有变更提交并推送到 GitHub 远程仓库 `git@github.com:dz1113/dongzhao.git`。

## 远程仓库信息

- **HTTPS**: `https://github.com/dz1113/dongzhao.git`
- **SSH**: `git@github.com:dz1113/dongzhao.git`（使用已配置的 SSH 公钥）

## 执行步骤

按顺序执行以下命令，**每一步都要检查输出，失败时停止并报告原因**：

### 1. 初始化 Git 仓库（如未初始化）

```powershell
git rev-parse --is-inside-work-tree 2>$null
```

如果退出码非零（不是 git 仓库），执行：

```powershell
git init
```

### 2. 检查并设置远程仓库

```powershell
git remote -v
```

- 如果没有 `origin`，添加：
  ```powershell
  git remote add origin git@github.com:dz1113/dongzhao.git
  ```
- 如果已有 `origin` 但地址不对，更新：
  ```powershell
  git remote set-url origin git@github.com:dz1113/dongzhao.git
  ```

### 3. 配置 Git 用户信息（如未设置）

```powershell
git config user.name
git config user.email
```

如果为空，提示用户提供姓名和邮箱，然后设置：
```powershell
git config user.name "<用户名>"
git config user.email "<邮箱>"
```

### 4. 检查变更

```powershell
git status --short
```

- 如果没有输出（working tree clean），告知用户没有需要提交的内容并停止。
- 如果有变更，继续下一步。

### 5. 添加所有变更

```powershell
git add -A
```

### 6. 提交

根据变更内容生成有意义的 commit message，格式为中文，简明描述改动：

```powershell
git commit -m "<自动生成的提交信息>"
```

如果用户明确提供了 commit message，优先使用用户提供的。

### 7. 确定并设置默认分支

```powershell
git branch
```

- 如果当前分支是 `master`，推送到 `master`。
- 如果当前分支是 `main` 或其他，推送到该分支。
- 首次推送时使用 `-u` 建立跟踪关系：
  ```powershell
  git push -u origin <分支名>
  ```
- 后续推送：
  ```powershell
  git push
  ```

### 8. 处理常见错误

| 错误 | 处理 |
|------|------|
| `Permission denied (publickey)` | SSH 公钥未添加到 GitHub，提示用户到 https://github.com/settings/keys 添加公钥（公钥路径 `~/.ssh/id_ed25519.pub`） |
| `connect to host github.com port 22: Connection refused` | 网络封锁了 22 端口。改用 443 端口推送：先执行 `git config core.sshCommand "ssh -p 443 -o Hostname=ssh.github.com"`（一次性设置，仓库内长期生效），再重新 `git push` |
| `rejected` / `non-fast-forward` | 远程有新提交，先 `git pull --rebase origin <分支>` 再推送 |
| `src refspec ... does not match any` | 没有任何提交，先做一次 commit |

### 9. 完成后报告

输出推送结果摘要，包括：
- 推送的分支名
- 提交的文件数量和变更行数（如有）
- 远程仓库地址

## 注意事项

- **不要**推送包含敏感信息的文件（密钥、密码等）
- 如果存在 `.gitignore`，遵循其规则（`git add -A` 会自动排除）
- 大文件（>100MB）会被 GitHub 拒绝推送，提醒用户使用 Git LFS
- **不要**自动设置 `git push --force`，除非用户明确要求
