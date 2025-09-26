import { render, screen } from "@testing-library/react";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
  it("renders brand link with logo and text", () => {
    render(<Navbar />);

    // The whole brand area is a link to "/"
    const brandLink = screen.getByRole("link", { name: /grants2contract/i });
    expect(brandLink).toBeInTheDocument();
    expect(brandLink).toHaveAttribute("href", "/");

    // Logo image (by its alt text in the component)
    const logo = screen.getByRole("img", { name: /grants2contract logo/i });
    expect(logo).toBeInTheDocument();

    // Brand text
    expect(screen.getByText(/grants2contract/i)).toBeInTheDocument();
  });

  it("renders the actions passed in", () => {
    render(
      <Navbar
        actions={
          <>
            <a href="/chat">Start Chat</a>
            <a href="/login">Sign In</a>
          </>
        }
      />
    );

    // Actions show up as links
    expect(screen.getByRole("link", { name: /start chat/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /sign in/i })).toBeInTheDocument();
  });

  it("has a navigation landmark", () => {
    render(<Navbar />);
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});