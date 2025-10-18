# Backend Tests

Comprehensive test suite for the Legal AI Query & Referral System backend.

## 📋 Test Coverage

### API Endpoint Tests
- **test_auth.py**: Authentication and JWT token tests
  - Login endpoint with valid/invalid credentials
  - Token-based endpoint protection
  - Admin authentication

- **test_templates.py**: Template management tests
  - Getting templates by type
  - Saving templates (admin only)
  - Template validation

- **test_chats.py**: Chat session tests
  - Creating chat sessions
  - Upserting answers (common, simple, complex)
  - Finalizing chats with AI routing
  - Attachment handling

- **test_analytics.py**: Analytics and KPIs tests
  - KPI metrics with date ranges
  - Choice question analytics
  - Excel export functionality
  - Authentication requirements

- **test_escalations.py**: Escalation workflow tests
  - Escalating queries
  - Completing queries without escalation
  - Email notification triggers

- **test_config.py**: Configuration management tests
  - Updating escalation email recipient
  - Email validation
  - Authentication requirements

- **test_uploads.py**: File upload tests
  - Uploading various file types
  - File type validation
  - Chat association
  - Multipart form data handling

### Model Tests
- **test_models.py**: Database model tests
  - User model (creation, password hashing, finding by username/email)
  - Chat model (creation, answer upserting, attachments)
  - Template model (creation, versioning, finding by type)
  - AppConfig model (getting/setting configuration)

### Utility Tests
- **test_utils.py**: Utility function tests
  - Email validation
  - Template type validation
  - Date range parsing (dd/MM/yyyy format)

### Basic Tests
- **test_routes.py**: Main route tests
  - Health check endpoint
  - Root endpoint
  - 404 handling

## 🚀 Running Tests

### Run All Tests
```bash
docker-compose exec backend pytest
```

### Run with Verbose Output
```bash
docker-compose exec backend pytest -v
```

### Run with Coverage Report
```bash
docker-compose exec backend pytest --cov=app --cov-report=html
```

### Run Specific Test File
```bash
docker-compose exec backend pytest tests/test_auth.py
```

### Run Specific Test Class
```bash
docker-compose exec backend pytest tests/test_auth.py::TestLogin
```

### Run Specific Test Function
```bash
docker-compose exec backend pytest tests/test_auth.py::TestLogin::test_successful_login
```

### Run Tests Matching Pattern
```bash
docker-compose exec backend pytest -k "login"
```

## 📊 Test Fixtures

Defined in `conftest.py`:

- **app**: Flask application instance with test configuration
- **client**: Test client for making HTTP requests
- **admin_user**: Pre-created admin user for authentication tests
- **auth_token**: JWT token for authenticated requests
- **auth_headers**: Authorization headers with Bearer token
- **sample_template**: Pre-created template for testing
- **sample_chat**: Pre-created chat session for testing

## 🔧 Test Configuration

Tests use a separate MongoDB test database configured in `app/config.py`:

```python
class TestingConfig(Config):
    TESTING = True
    MONGODB_URI = "mongodb://localhost:27017/legal_ai_test"
```

The test database is automatically cleaned before and after each test to ensure isolation.

## ✅ Test Guidelines

### Writing New Tests

1. **Use descriptive test names**: Tests should clearly describe what they're testing
   ```python
   def test_login_with_invalid_password(self, client, admin_user):
   ```

2. **Follow AAA pattern**: Arrange, Act, Assert
   ```python
   # Arrange
   user_data = {"username": "test", "password": "pass"}
   
   # Act
   response = client.post("/login", json=user_data)
   
   # Assert
   assert response.status_code == 200
   ```

3. **Test both success and failure cases**: Ensure proper error handling
   ```python
   def test_successful_operation(self):
       # Test happy path
   
   def test_operation_with_invalid_input(self):
       # Test error handling
   ```

4. **Use fixtures for setup**: Keep tests DRY and focused
   ```python
   def test_with_authenticated_user(self, client, auth_headers):
       response = client.get("/protected", headers=auth_headers)
   ```

5. **Test database state**: Verify database changes when appropriate
   ```python
   def test_user_creation_saves_to_db(self, app):
       user = User(username="test")
       user.save(app.db)
       
       # Verify it was saved
       found = User.find_by_username(app.db, "test")
       assert found is not None
   ```

### Test Organization

- Group related tests in classes
- One test file per API blueprint or model
- Use descriptive docstrings
- Keep tests isolated and independent

## 📈 Coverage Goals

Target: **80%+ code coverage**

Check current coverage:
```bash
docker-compose exec backend pytest --cov=app --cov-report=term-missing
```

## 🐛 Debugging Tests

### Run with pdb on failure
```bash
docker-compose exec backend pytest --pdb
```

### Run with print output
```bash
docker-compose exec backend pytest -s
```

### Run last failed tests only
```bash
docker-compose exec backend pytest --lf
```

## 📝 Test Data

- **Admin credentials**: username=`testadmin`, password=`testpass123`
- **Test email**: `test@example.com`
- **Sample chat IDs**: Generated with `chat_` prefix
- **Sample file IDs**: Generated with `f_` prefix

## 🔍 Common Test Scenarios

### Testing Protected Endpoints
```python
def test_protected_endpoint(self, client, auth_headers):
    response = client.get("/kpis", headers=auth_headers)
    assert response.status_code == 200
```

### Testing File Uploads
```python
def test_file_upload(self, client, sample_chat):
    data = {
        "chat_id": sample_chat.chat_id,
        "file": (io.BytesIO(b"content"), "test.pdf")
    }
    response = client.post("/uploads", data=data, content_type="multipart/form-data")
    assert response.status_code == 201
```

### Testing JSON Responses
```python
def test_json_response(self, client):
    response = client.get("/templates?template=common")
    data = response.get_json()
    assert isinstance(data, list)
```

## 🎯 Next Steps

- [ ] Add integration tests for AI service communication
- [ ] Add performance tests for large datasets
- [ ] Add load tests with locust/pytest-benchmark
- [ ] Set up CI/CD pipeline with automated testing
- [ ] Add test coverage badges to README

## 📚 Resources

- [pytest Documentation](https://docs.pytest.org/)
- [Flask Testing](https://flask.palletsprojects.com/en/3.0.x/testing/)
- [pytest-flask Plugin](https://pytest-flask.readthedocs.io/)
