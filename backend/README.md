# ElectroPhysics Backend RBAC

This backend now includes role-based access control for:
- `ADMIN`
- `TEACHER`
- `STUDENT`

## Access rules
- Student can read only their own student profile via `GET /api/students/me`
- Teacher can read only their own teacher profile via `GET /api/teachers/me`
- Admin can read all users and any profile via:
  - `GET /api/admin/users`
  - `GET /api/students/{userId}`
  - `GET /api/teachers/{userId}`

## Demo seed users
The app seeds demo users at startup (if DB is empty):
- `admin1 / admin123`
- `teacher1 / teacher123`
- `student1 / student123`

## Run
```bash
./mvnw spring-boot:run
```
(Windows PowerShell)
```powershell
.\mvnw.cmd spring-boot:run
```

## Test
```bash
./mvnw test
```
(Windows PowerShell)
```powershell
.\mvnw.cmd test
```

## Deploy Backend To Railway
1. In Railway, create a new project and deploy from your GitHub repo.
2. Set the service root directory to `backend`.
3. Add a PostgreSQL service in the same Railway project.
4. In backend service variables, configure either option A or option B:
  - Option A (recommended): no datasource variables needed if your app and Postgres are in the same Railway project. The app reads `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` directly.
  - Option B (explicit):
    - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://${{Postgres.PGHOST}}:${{Postgres.PGPORT}}/${{Postgres.PGDATABASE}}`
    - `SPRING_DATASOURCE_USERNAME` = `${{Postgres.PGUSER}}`
    - `SPRING_DATASOURCE_PASSWORD` = `${{Postgres.PGPASSWORD}}`
5. Deploy. Railway will build with Maven and start using `railway.json`.

Notes:
- Port binding is automatic via `server.port=${PORT:8081}`.
- Local development still works with defaults in `application.properties`.
- Nixpacks JDK is pinned to 21 via `nixpacks.toml` (required for Spring Boot 4).
- If needed, set Railway variable `NIXPACKS_JDK_VERSION=21` explicitly.

