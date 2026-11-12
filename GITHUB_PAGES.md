# GitHub Pages 部署指南

## 首次設定

1. 安裝 [Git](https://git-scm.com/downloads)、[GitHub CLI](https://cli.github.com/)、Node.js 22 或更新版本，以及 [Bun](https://bun.sh/)。
2. 在終端機登入正確的 GitHub 帳號：

   ```powershell
   gh auth login
   gh auth status
   ```

   登入帳號必須是 `tr-jeff-wei`。

3. 若 Git 尚未設定提交者資訊，先設定一次：

   ```powershell
   git config --global user.name "你的名稱"
   git config --global user.email "你的 GitHub 電子郵件"
   ```

4. 雙擊專案根目錄的 `commit-push-deploy.bat`。確認將要提交的檔案後，輸入提交訊息；第一次執行時也要選擇建立 `public` 或 `private` 的 `tr-jeff-wei/python-island` repository。若 repository 已建立，請先將 `origin` 設為該 repository，再執行此 BAT。
5. 在 GitHub repository 開啟 **Settings → Pages**，將 **Build and deployment → Source** 設為 **GitHub Actions**。
6. 到 **Actions** 頁面確認 `Build and deploy to GitHub Pages` 工作完成。網站網址為：

   <https://tr-jeff-wei.github.io/python-island/>

GitHub Pages 網站會公開給任何人瀏覽。免費方案通常需要公開 repository；私人 repository 的 Pages 可用性依 GitHub 方案而異。請勿在原始碼、`.env` 或提交紀錄放入 API key、密碼或其他機密。

## 之後更新

修改程式並確認內容無誤後，雙擊 `commit-push-deploy.bat`，輸入提交訊息。腳本會 stage 變更、建立 commit 並 push 到 `main`；GitHub Actions 隨後會自動建置及部署。可在 repository 的 **Actions** 頁面查看部署狀態。

腳本不會自動覆蓋其他 `origin` 遠端，也只允許從 `main` 分支部署。請確認 `.gitignore` 已排除本機設定與機密檔案，並檢查提交內容後再推送。

## 本機檢查

```powershell
bun install
bun run lint
bun run build
```

GitHub Actions 使用 `bun.lock` 安裝相依套件，並以 `/python-island/` 作為網站子路徑建置；`404.html` 會支援 GitHub Pages 上的 `/knowledge-map` 前端路由。
