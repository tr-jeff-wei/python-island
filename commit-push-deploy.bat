@echo off
setlocal
cd /d "%~dp0"

git rev-parse --is-inside-work-tree >nul 2>nul
if errorlevel 1 (
  echo ERROR: This folder is not a Git repository.
  pause
  exit /b 1
)

for /f "delims=" %%B in ('git branch --show-current') do set "CURRENT_BRANCH=%%B"
if /i not "%CURRENT_BRANCH%"=="main" (
  echo ERROR: Switch to the main branch before deploying.
  echo Current branch: %CURRENT_BRANCH%
  pause
  exit /b 1
)

git add -A
if errorlevel 1 (
  echo ERROR: Could not stage changes.
  pause
  exit /b 1
)

git diff --cached --quiet
if not errorlevel 1 (
  echo No changes to commit.
  exit /b 0
)

echo.
echo Changes selected for this commit:
git status --short
set "CONFIRM_COMMIT="
set /p "CONFIRM_COMMIT=Commit and push these changes? [y/N]: "
if /i not "%CONFIRM_COMMIT%"=="y" (
  echo Cancelled. The changes remain staged.
  exit /b 0
)

set "COMMIT_MESSAGE="
set /p "COMMIT_MESSAGE=Commit message: "
if not defined COMMIT_MESSAGE set "COMMIT_MESSAGE=Update site"

git commit -m "%COMMIT_MESSAGE%"
if errorlevel 1 (
  echo ERROR: Commit failed. Check your Git name and email configuration.
  pause
  exit /b 1
)

git remote get-url origin >nul 2>nul
if errorlevel 1 goto create_repo

for /f "delims=" %%U in ('git remote get-url origin') do set "ORIGIN_URL=%%U"
echo %ORIGIN_URL% | findstr /i /c:"github.com/tr-jeff-wei/python-island" /c:"github.com:tr-jeff-wei/python-island" >nul
if errorlevel 1 (
  echo ERROR: The origin remote is not tr-jeff-wei/python-island:
  echo %ORIGIN_URL%
  echo Update the origin remote manually, then run this file again.
  pause
  exit /b 1
)

git push -u origin main
if errorlevel 1 (
  echo ERROR: Push failed. Check your GitHub authentication and remote settings.
  pause
  exit /b 1
)
goto done

:create_repo
where gh >nul 2>nul
if errorlevel 1 (
  echo ERROR: GitHub CLI (gh) is required to create the repository.
  echo Install it from https://cli.github.com/ and run: gh auth login
  pause
  exit /b 1
)

gh auth status >nul 2>nul
if errorlevel 1 (
  echo ERROR: Sign in to GitHub CLI first by running: gh auth login
  pause
  exit /b 1
)

for /f "delims=" %%U in ('gh api user --jq .login 2^>nul') do set "GH_USER=%%U"
if /i not "%GH_USER%"=="tr-jeff-wei" (
  echo ERROR: GitHub CLI is logged in as "%GH_USER%", not "tr-jeff-wei".
  echo Run gh auth login with the intended GitHub account, then retry.
  pause
  exit /b 1
)

echo GitHub Pages websites are publicly accessible.
echo Choose repository visibility. Public is recommended for a free Pages site.
set /p "VISIBILITY=Create the repository as public or private? [public/private]: "
if /i "%VISIBILITY%"=="public" (
  set "VISIBILITY_FLAG=--public"
) else if /i "%VISIBILITY%"=="private" (
  set "VISIBILITY_FLAG=--private"
) else (
  echo ERROR: Enter either public or private.
  pause
  exit /b 1
)

gh repo create tr-jeff-wei/python-island --source . --remote origin %VISIBILITY_FLAG% --push
if errorlevel 1 (
  echo ERROR: Repository creation or initial push failed.
  echo If the repository already exists, add it as origin and run this file again.
  pause
  exit /b 1
)

:done
echo.
echo Source pushed successfully. GitHub Actions will build and deploy the site.
echo Monitor deployment at:
echo https://github.com/tr-jeff-wei/python-island/actions
echo.
pause
