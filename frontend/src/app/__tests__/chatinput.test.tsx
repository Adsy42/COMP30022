import React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ChatInput from "@/components/ChatInput";

describe("Chat input composer", () => {
  test("basic flow: type, submit with Enter, busy cooldown, re-enable", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSend = jest.fn();

    render(<ChatInput onSend={onSend} />);

    const textarea = screen.getByPlaceholderText(/start typing/i) as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /send/i });

    // initial render
    expect(textarea).toBeInTheDocument();
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled(); // empty => disabled

    // type a message
    await user.type(textarea, "hello world");
    expect(button).toBeEnabled();

    // submit via Enter (no Shift)
    await user.keyboard("{Enter}");

    // sent once with the typed value (component trims; adjust if you removed trim)
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenLastCalledWith("hello world");

    // clears and goes into waiting state
    expect(textarea.value).toBe("");
    expect(textarea).toBeDisabled();
    expect(button).toBeDisabled();

    // cooldown finishes after 1s
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // textarea re-enabled; button disabled again because empty
    expect(textarea).toBeEnabled();
    expect(button).toBeDisabled();

    jest.useRealTimers();
  });

  test("requireText blocks empty submits even if allowEmptySubmit is true", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSend = jest.fn();

    render(
      <ChatInput
        onSend={onSend}
        allowEmptySubmit={true}
        requireText={true} // e.g., when 'Other' selected
      />
    );

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /send/i });

    // Empty + requireText => both Enter and button should be blocked
    expect(button).toBeDisabled();
    await user.keyboard("{Enter}");
    expect(onSend).not.toHaveBeenCalled();

    // Type only whitespace -> still blocked
    await user.type(textarea, "   ");
    expect(button).toBeDisabled();
    await user.keyboard("{Enter}");
    expect(onSend).not.toHaveBeenCalled();

    // Type a real character -> enabled and allowed
    await user.clear(textarea);
    await user.type(textarea, "specified value");
    expect(button).toBeEnabled();

    await user.keyboard("{Enter}");
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenLastCalledWith("specified value");

    // busy cooldown kicks in
    expect(textarea).toBeDisabled();
    await act(async () => {
      jest.advanceTimersByTime(1000);
    });
    expect(textarea).toBeEnabled();

    jest.useRealTimers();
  });

  test("externalBusy disables the textarea but not the button (when empty submits are allowed)", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSend = jest.fn();

    render(
      <ChatInput
        onSend={onSend}
        externalBusy={true}     // parent locks typing (e.g., non-freeform & 'Other' not selected)
        allowEmptySubmit={true} // parent allows empty submit for choice questions
        requireText={false}
      />
    );

    const textarea = screen.getByRole("textbox") as HTMLTextAreaElement;
    const button = screen.getByRole("button", { name: /send/i });

    // Textarea is locked by externalBusy, but button is enabled (since empty submits allowed)
    expect(textarea).toBeDisabled();
    expect(button).toBeEnabled();

    // Click submit with empty input -> allowed, calls onSend("")
    await user.click(button);
    expect(onSend).toHaveBeenCalledTimes(1);
    expect(onSend).toHaveBeenLastCalledWith("");

    // Immediately waits for cooldown
    expect(textarea).toBeDisabled();

    await act(async () => {
      jest.advanceTimersByTime(1000);
    });

    // After cooldown, still disabled because externalBusy remains true
    expect(textarea).toBeDisabled();

    jest.useRealTimers();
  });
});
