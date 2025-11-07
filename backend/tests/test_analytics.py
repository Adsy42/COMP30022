"""Tests for analytics endpoints."""


class TestKPIs:
    """Test GET /kpis endpoint."""

    def test_get_kpis_without_dates(self, client, auth_headers):
        """Test getting KPIs without date range."""
        response = client.get("/api/kpis", headers=auth_headers)
        assert response.status_code == 200
        data = response.get_json()
        assert "total_queries" in data
        assert "simple_queries" in data
        assert "ai_resolved_queries" in data

    def test_get_kpis_with_date_range(self, client, auth_headers):
        """Test getting KPIs with date range."""
        response = client.get(
            "/api/kpis?start_time=01/01/2025&end_time=31/12/2025",
            headers=auth_headers,
        )
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data["total_queries"], int)
        assert isinstance(data["simple_queries"], int)
        assert isinstance(data["ai_resolved_queries"], int)

    def test_get_kpis_without_auth(self, client):
        """Test getting KPIs without authentication."""
        response = client.get("/api/kpis")
        assert response.status_code == 401

    def test_get_kpis_invalid_date_format(self, client, auth_headers):
        """Test getting KPIs with invalid date format."""
        response = client.get(
            "/api/kpis?start_time=2025-01-01&end_time=2025-12-31",
            headers=auth_headers,
        )
        assert response.status_code == 400


class TestChoiceAnalytics:
    """Test POST /analytics/choice endpoint."""

    def test_get_choice_analytics(self, client, auth_headers):
        """Test getting choice analytics."""
        analytics_data = {"start_time": "01/01/2025", "end_time": "31/12/2025"}
        response = client.post(
            "/api/analytics/choice", headers=auth_headers, json=analytics_data
        )
        assert response.status_code == 200
        data = response.get_json()
        assert isinstance(data, list)

    def test_get_choice_analytics_with_template_filter(self, client, auth_headers):
        """Test getting choice analytics with template filter."""
        analytics_data = {
            "start_time": "01/01/2025",
            "end_time": "31/12/2025",
            "template": "common",
        }
        response = client.post(
            "/api/analytics/choice", headers=auth_headers, json=analytics_data
        )
        assert response.status_code == 200

    def test_get_choice_analytics_missing_dates(self, client, auth_headers):
        """Test getting choice analytics without dates."""
        response = client.post(
            "/api/analytics/choice", headers=auth_headers, json={}
        )
        assert response.status_code == 400

    def test_get_choice_analytics_without_auth(self, client):
        """Test getting choice analytics without authentication."""
        analytics_data = {"start_time": "01/01/2025", "end_time": "31/12/2025"}
        response = client.post("/api/analytics/choice", json=analytics_data)
        assert response.status_code == 401


class TestChoiceAnalyticsExport:
    """Test GET /analytics/choice-export endpoint."""

    def test_export_choice_analytics(self, client, auth_headers):
        """Test exporting choice analytics as Excel."""
        response = client.get(
            "/api/analytics/choice-export?start_time=01/01/2025&end_time=31/12/2025",
            headers=auth_headers,
        )
        assert response.status_code == 200
        assert (
            response.content_type
            == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )

    def test_export_without_dates(self, client, auth_headers):
        """Test exporting without date parameters."""
        response = client.get("/api/analytics/choice-export", headers=auth_headers)
        assert response.status_code == 400

    def test_export_without_auth(self, client):
        """Test exporting without authentication."""
        response = client.get(
            "/api/analytics/choice-export?start_time=01/01/2025&end_time=31/12/2025"
        )
        assert response.status_code == 401
