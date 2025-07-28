import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Test Button</Button>);
    const button = screen.getByRole('button', { name: /test button/i });
    expect(button).toBeInTheDocument();
  });

  test('handles click events', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    fireEvent.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('applies variant classes correctly', () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('bg-blue-600');

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('bg-gray-100');

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('border');

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-600');
  });

  test('applies size classes correctly', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    let button = screen.getByRole('button');
    expect(button.className).toContain('h-9');

    rerender(<Button size="default">Default</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('h-10');

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole('button');
    expect(button.className).toContain('h-11');
  });

  test('disables button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    const button = screen.getByRole('button');
    
    expect(button).toBeDisabled();
    expect(button.className).toContain('disabled:pointer-events-none');
  });

  test('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('custom-class');
  });

  test('renders with default variant and size when not specified', () => {
    render(<Button>Default Button</Button>);
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-blue-600'); // default variant
    expect(button.className).toContain('h-10'); // default size
  });
});