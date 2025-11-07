"""Tests for utility functions."""

import pytest
from app.utils.validators import validate_email, validate_template_type
from app.utils.helpers import parse_date_range
from datetime import datetime


class TestValidators:
    """Test validation functions."""

    def test_validate_email_valid(self):
        """Test validating valid email addresses."""
        assert validate_email("user@example.com") is True
        assert validate_email("test.user@domain.co.uk") is True
        assert validate_email("admin+tag@example.org") is True

    def test_validate_email_invalid(self):
        """Test validating invalid email addresses."""
        assert validate_email("not-an-email") is False
        assert validate_email("@example.com") is False
        assert validate_email("user@") is False
        assert validate_email("") is False
        assert validate_email(None) is False

    def test_validate_template_type_valid(self):
        """Test validating valid template types."""
        assert validate_template_type("common") is True
        assert validate_template_type("simple") is True
        assert validate_template_type("complex") is True

    def test_validate_template_type_invalid(self):
        """Test validating invalid template types."""
        assert validate_template_type("invalid") is False
        assert validate_template_type("") is False
        assert validate_template_type(None) is False


class TestHelpers:
    """Test helper functions."""

    def test_parse_date_range_valid(self):
        """Test parsing valid date range."""
        start_dt, end_dt = parse_date_range("01/01/2025", "31/12/2025")
        assert isinstance(start_dt, datetime)
        assert isinstance(end_dt, datetime)
        assert start_dt.year == 2025
        assert start_dt.month == 1
        assert start_dt.day == 1
        assert end_dt.year == 2025
        assert end_dt.month == 12
        assert end_dt.day == 31
        # End time should be set to end of day
        assert end_dt.hour == 23
        assert end_dt.minute == 59
        assert end_dt.second == 59

    def test_parse_date_range_invalid_format(self):
        """Test parsing with invalid date format."""
        with pytest.raises(ValueError):
            parse_date_range("2025-01-01", "2025-12-31")

        with pytest.raises(ValueError):
            parse_date_range("01/13/2025", "12/31/2025")  # Invalid month

        with pytest.raises(ValueError):
            parse_date_range("not a date", "31/12/2025")
