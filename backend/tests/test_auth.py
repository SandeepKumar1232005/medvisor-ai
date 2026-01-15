import json

def test_register(client, init_database):
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    assert response.status_code == 201
    assert b"User created successfully" in response.data

def test_register_duplicate_user(client, init_database):
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    response = client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'other@example.com',
        'password': 'password456'
    })
    assert response.status_code == 409
    assert b"Username already exists" in response.data

def test_login(client, init_database):
    client.post('/api/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'password123'
    })
    response = client.post('/api/auth/login', json={
        'username': 'testuser',
        'password': 'password123'
    })
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'access_token' in data
