import { describe, it, expect, vi, afterEach } from "vitest";
import { act, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useDebounce } from "@/hooks/useDebounce";

function DebounceProbe({
  value,
  delay,
  onValue,
}: {
  value: string;
  delay: number;
  onValue: (next: string) => void;
}) {
  const debounced = useDebounce(value, delay);

  useEffect(() => {
    onValue(debounced);
  }, [debounced, onValue]);

  return null;
}

function createHarness() {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);

  return {
    root,
    cleanup() {
      act(() => {
        root.unmount();
      });
      container.remove();
    },
  };
}

describe("useDebounce", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const history: string[] = [];
    const harness = createHarness();

    act(() => {
      harness.root.render(
        <DebounceProbe value="initial" delay={300} onValue={(v) => history.push(v)} />
      );
    });

    expect(history.at(-1)).toBe("initial");
    harness.cleanup();
  });

  it("does not update the value before delay", () => {
    vi.useFakeTimers();
    const history: string[] = [];
    const harness = createHarness();

    act(() => {
      harness.root.render(
        <DebounceProbe value="initial" delay={300} onValue={(v) => history.push(v)} />
      );
    });
    act(() => {
      harness.root.render(
        <DebounceProbe value="updated" delay={300} onValue={(v) => history.push(v)} />
      );
    });

    expect(history.at(-1)).toBe("initial");
    harness.cleanup();
  });

  it("updates the value after delay", () => {
    vi.useFakeTimers();
    const history: string[] = [];
    const harness = createHarness();

    act(() => {
      harness.root.render(
        <DebounceProbe value="initial" delay={300} onValue={(v) => history.push(v)} />
      );
    });
    act(() => {
      harness.root.render(
        <DebounceProbe value="updated" delay={300} onValue={(v) => history.push(v)} />
      );
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });

    expect(history.at(-1)).toBe("updated");
    harness.cleanup();
  });

  it("resets timer on rapid changes", () => {
    vi.useFakeTimers();
    const history: string[] = [];
    const harness = createHarness();

    act(() => {
      harness.root.render(<DebounceProbe value="a" delay={300} onValue={(v) => history.push(v)} />);
    });
    act(() => {
      harness.root.render(<DebounceProbe value="b" delay={300} onValue={(v) => history.push(v)} />);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      harness.root.render(<DebounceProbe value="c" delay={300} onValue={(v) => history.push(v)} />);
    });
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(history.at(-1)).toBe("a");

    act(() => {
      vi.advanceTimersByTime(100);
    });
    expect(history.at(-1)).toBe("c");
    harness.cleanup();
  });
});
