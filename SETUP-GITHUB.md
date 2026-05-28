# Criar / publicar no GitHub

O repositório local já existe em `c:\_PROJETOS\geogrowth`.  
Para criar o remoto em **RivasCode-Ops/geogrowth**, autentique o GitHub CLI uma vez:

## 1. Login (uma vez no PC)

```powershell
gh auth login
```

Escolha: GitHub.com → HTTPS → Login no browser.

## 2. Criar repo e enviar

```powershell
cd c:\_PROJETOS\geogrowth
gh repo create RivasCode-Ops/geogrowth --public --source=. --remote=origin --push
```

Se o repo já existir vazio no GitHub:

```powershell
cd c:\_PROJETOS\geogrowth
git remote add origin https://github.com/RivasCode-Ops/geogrowth.git
git push -u origin main
```

## 3. Conferir

```powershell
gh repo view RivasCode-Ops/geogrowth --web
```
