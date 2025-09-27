import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "@/components/ChatInput";

describe("Chat input composer", () => {
  test("renders and full composer flow works", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });

    // Spy on console.log to verify submitted payloads
    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    render(<ChatInput />);

    const textarea = screen.getByPlaceholderText(/start typing/i) as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /send/i });

    // It renders
    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();

    // Can't submit when empty
    expect(button).toBeDisabled();

    // Type first message
    await user.type(textarea, "hello world");

    // Button should enable once non-empty
    expect(button).toBeEnabled();

    // Press Enter => submits and logs
    await user.keyboard("{Enter}");

    // Input cleared
    expect(textarea.value).toBe("");

    // Logged exactly once with trimmed payload
    expect(logSpy).toHaveBeenCalledTimes(1);
    expect(logSpy).toHaveBeenLastCalledWith("hello world");

    // Disabled immediately after submission
    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();

    // Re-enabled after 1s
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(textarea).toBeEnabled();
    expect(button).toBeDisabled(); // still disabled because empty again

    // Can type and submit again
    await user.type(textarea, "second run");
    expect(button).toBeEnabled();

    // Submit via click this time
    await user.click(button);

    expect(logSpy).toHaveBeenCalledTimes(2);
    expect(logSpy).toHaveBeenLastCalledWith("second run");

    // Goes busy again, then re-enables after timer
    expect(textarea).toBeDisabled();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(textarea).toBeEnabled();

    logSpy.mockRestore();
    jest.useRealTimers();
  });
});