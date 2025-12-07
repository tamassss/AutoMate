from django.test import TestCase
from django.db import connection

class DatabaseConnectionTest(TestCase):

    def test_connection(self):
        """Check DB connection works."""
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1;")
                result = cursor.fetchone()[0]
            self.assertEqual(result, 1)
        except Exception as e:
            self.fail(f"Database connection failed: {e}")


class FelhasznaloTableTest(TestCase):

    def test_felhasznalo_insert(self):
        """Insert a test user into felhasznalo."""
        from django.db import connection

        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO felhasznalo (email, jelszo_hash, nev, szerep)
                VALUES ('test@example.com', 'hashed_pw', 'Test User', 'user');
            """)

            cursor.execute("SELECT email FROM felhasznalo WHERE email='test@example.com';")
            result = cursor.fetchone()

        self.assertIsNotNone(result)
        self.assertEqual(result[0], "test@example.com")


class MarkaTest(TestCase):
    
    def test_create_marka(self):
        """Test inserting new brand."""
        with connection.cursor() as cursor:
            cursor.execute("INSERT INTO marka (nev) VALUES ('Toyota');")
            cursor.execute("SELECT nev FROM marka WHERE nev='Toyota';")
            result = cursor.fetchone()

        self.assertEqual(result[0], "Toyota")
