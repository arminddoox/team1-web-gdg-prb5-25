## Workflow Guideline

### Clone project

```bash
git clone team1-web-gdg-prb5-25.git
cd team1-web-gdg-prb5-25
npm install
```

### Create a .env file in the Project Root

```env
# Frontend variables (VITE_ prefix needed)
VITE_API_URL=http://localhost:3000
VITE_API_TIMEOUT=15000

# Backend variables (no prefix needed)
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb+srv://team1-web-gdg-prb5-25:<password>@team1-web-gdg-prb5-25.3jpyl4j.mongodb.net/<database>?retryWrites=true&w=majority&appName=team1-web-gd0-prb5-25
JWT_SECRET=your-<secret-jwt-key>
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
BCRYPT_SALT_ROUNDS=10
```

### Scripts commands (listed in package.json)
```bash
npm run dev           # Host local frontend
npm run dev:backend   # Host local backend
npm run dev:all		    # Host both frontend and backend locally
npm run build		      # Frontend needs to run this command before pushing to Github
npm run lint		      # Format code using ESLint
```

### Updating features to Github
A **new branch** needs to be created
```bash
git checkout -b NewFeatureBranch
git add .
git commit -m “Commit message”
git push origin -u NewFeatureBranch
```
Then open a **Pull Request** on Github.

### If adding new packages
If adding new packages by using the command 
```bash
npm install <packages>
```
or by make any change on `package.json`.
It is required to explain the reasons and purpose of new packages.
*The coding environment depends on `package.json`; any issues with this file may cause deployment errors.*