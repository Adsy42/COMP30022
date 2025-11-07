"""Helper functions."""

from datetime import datetime


def parse_date_range(start_time_str, end_time_str):
    """
    Parse date range from strings in dd/MM/yyyy format.

    Args:
        start_time_str: Start date string
        end_time_str: End date string

    Returns:
        tuple: (start_datetime, end_datetime)

    Raises:
        ValueError: If date format is invalid
    """
    try:
        start_dt = datetime.strptime(start_time_str, "%d/%m/%Y")
        end_dt = datetime.strptime(end_time_str, "%d/%m/%Y")

        # Set end time to end of day
        end_dt = end_dt.replace(hour=23, minute=59, second=59)

        return start_dt, end_dt
    except ValueError as e:
        raise ValueError(f"Invalid date format. Expected dd/MM/yyyy: {str(e)}")
