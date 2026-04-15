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

