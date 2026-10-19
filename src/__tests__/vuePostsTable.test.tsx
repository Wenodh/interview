import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import VueInterviewPractice from '../components/VueInterviewPractice';
import { fetchJsonPlaceholderPosts } from '../utils/vuePostsFetcher';

describe('Vue 3 JSONPlaceholder Posts Table - Pure Fetcher Tests', () => {
  it('1. Successful API response returns array of posts with no error', async () => {
    const mockPosts = [
      { id: 1, userId: 101, title: 'Test Post 1', body: 'Body 1' },
      { id: 2, userId: 102, title: 'Test Post 2', body: 'Body 2' },
    ];

    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockPosts,
    });

    const result = await fetchJsonPlaceholderPosts(mockFetch as unknown as typeof fetch);
    expect(result.error).toBeNull();
    expect(result.posts).toHaveLength(2);
    expect(result.posts[0].title).toBe('Test Post 1');
  });

  it('2. Empty API response returns empty posts array with no error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [],
    });

    const result = await fetchJsonPlaceholderPosts(mockFetch as unknown as typeof fetch);
    expect(result.error).toBeNull();
    expect(result.posts).toEqual([]);
  });

  it('3. HTTP status error (500) returns HTTP error message', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
    });

    const result = await fetchJsonPlaceholderPosts(mockFetch as unknown as typeof fetch);
    expect(result.posts).toEqual([]);
    expect(result.error).toContain('Failed to fetch posts: HTTP 500');
  });

  it('4. HTTP status error (404) returns HTTP error message', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
    });

    const result = await fetchJsonPlaceholderPosts(mockFetch as unknown as typeof fetch);
    expect(result.posts).toEqual([]);
    expect(result.error).toContain('Failed to fetch posts: HTTP 404');
  });

  it('5. Network rejection throws and returns error message', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error: Failed to fetch'));

    const result = await fetchJsonPlaceholderPosts(mockFetch as unknown as typeof fetch);
    expect(result.posts).toEqual([]);
    expect(result.error).toBe('Network error: Failed to fetch');
  });

  it('6. Non-array JSON response shape returns invalid shape error', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Not an array' }),
    });

    const result = await fetchJsonPlaceholderPosts(mockFetch as unknown as typeof fetch);
    expect(result.posts).toEqual([]);
    expect(result.error).toBe('Invalid posts response');
  });
});

describe('Vue 3 Interactive Practice Suite & Challenge Component Tests', () => {
  beforeEach(() => {
    // Mock global fetch for component tests
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, userId: 10, title: 'First Vue Post', body: 'Vue Post Body 1' },
        { id: 2, userId: 20, title: 'Second Vue Post', body: 'Vue Post Body 2' },
      ],
    }) as unknown as typeof fetch;
  });

  it('7. Renders Vue.js preparation header, disclaimer, and initial tab', () => {
    render(<VueInterviewPractice />);
    expect(screen.getByText(/Vue.js Interview Questions and Coding Practice/i)).toBeInTheDocument();
    expect(screen.getByText(/This preparation guide is based on readable topics/i)).toBeInTheDocument();
    expect(screen.getByText(/Overview & Assessment Metadata/i)).toBeInTheDocument();
  });

  it('8. Switches to Conceptual Questions tab and displays Question 1', () => {
    render(<VueInterviewPractice />);
    const conceptualTabBtn = screen.getByRole('button', { name: /Conceptual \(13\)/i });
    fireEvent.click(conceptualTabBtn);

    expect(screen.getByText(/What does Object.freeze\(\) do\?/i)).toBeInTheDocument();
    expect(screen.getByText(/Direct Answer:/i)).toBeInTheDocument();
  });

  it('9. Progressive hints reveal step-by-step', () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Conceptual \(13\)/i }));

    const showHintBtn = screen.getByText(/Show Hint 1/i);
    fireEvent.click(showHintBtn);

    expect(screen.getByText(/Hint 1:/i)).toBeInTheDocument();
  });

  it('10. Written answer draft evaluation calculates score and matches keywords', () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Conceptual \(13\)/i }));

    const textarea = screen.getByPlaceholderText(/Write your technical explanation here/i);
    fireEvent.change(textarea, {
      target: {
        value: 'Object.freeze shallowly freezes an object in strict mode. It prevents changing writable properties or adding nested properties.',
      },
    });

    fireEvent.click(screen.getByText(/Evaluate Written Answer Draft/i));

    expect(screen.getByText(/Automated Heuristic Rubric Check/i)).toBeInTheDocument();
    expect(screen.getByText(/Matched Vocabulary/i)).toBeInTheDocument();
  });

  it('11. Complete 8-part breakdown toggle shows all solution sections', () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Conceptual \(13\)/i }));

    const toggleBtn = screen.getByText(/Reveal Complete 8-Part Technical Solution/i);
    fireEvent.click(toggleBtn);

    expect(screen.getByText(/1. Direct Answer/i)).toBeInTheDocument();
    expect(screen.getByText(/2. Detailed Explanation/i)).toBeInTheDocument();
    expect(screen.getByText(/3. Practical Example/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Why This Answer Is Correct/i)).toBeInTheDocument();
    expect(screen.getByText(/5. Common Misconceptions/i)).toBeInTheDocument();
    expect(screen.getByText(/6. Follow-up Questions/i)).toBeInTheDocument();
    expect(screen.getByText(/7. Interview-Ready Answer/i)).toBeInTheDocument();
    expect(screen.getByText(/8. Advanced Discussion/i)).toBeInTheDocument();
  });

  it('12. MCQ Practice tab allows submitting answers and reveals explanations', () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /MCQ Practice \(26\)/i }));

    expect(screen.getByText(/MCQ 1:/i)).toBeInTheDocument();

    const optionB = screen.getByLabelText(/Only the top-level properties are frozen/i);
    fireEvent.click(optionB);

    fireEvent.click(screen.getByText(/Submit MCQ Answer/i));

    expect(screen.getByText(/Correct Answer!/i)).toBeInTheDocument();
    expect(screen.getByText(/Option Breakdown:/i)).toBeInTheDocument();
  });

  it('13. Coding Challenge tab renders Posts Table with live fetch data', async () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Coding Challenge/i }));

    await waitFor(() => {
      expect(screen.getByText('First Vue Post')).toBeInTheDocument();
      expect(screen.getByText('Second Vue Post')).toBeInTheDocument();
    });

    // Check accessible table headers
    expect(screen.getByText('Posts retrieved from JSONPlaceholder')).toBeInTheDocument();
    expect(screen.getByText('ID')).toBeInTheDocument();
    expect(screen.getByText('User ID')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Body')).toBeInTheDocument();
  });

  it('14. Simulator HTTP 500 error mode displays error alert and retry button', async () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Coding Challenge/i }));

    const errorModeBtn = screen.getByText(/HTTP 500 Error/i);
    fireEvent.click(errorModeBtn);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeInTheDocument();
      expect(screen.getByText(/Failed to fetch posts: HTTP 500/i)).toBeInTheDocument();
      expect(screen.getByText('🔄 Retry')).toBeInTheDocument();
    });
  });

  it('15. Simulator Empty mode displays "No posts found" table cell', async () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Coding Challenge/i }));

    const emptyModeBtn = screen.getByText(/Empty Posts Response/i);
    fireEvent.click(emptyModeBtn);

    await waitFor(() => {
      expect(screen.getByText('No posts found')).toBeInTheDocument();
    });
  });

  it('16. Topic Revision tab renders comparison matrices', () => {
    render(<VueInterviewPractice />);
    fireEvent.click(screen.getByRole('button', { name: /Topic Revision/i }));

    expect(screen.getByText(/1. Object.freeze\(\) vs Recursive Deep Freezing/i)).toBeInTheDocument();
    expect(screen.getByText(/4. Vue 3 ref\(\) vs reactive\(\)/i)).toBeInTheDocument();
    expect(screen.getByText(/7. Promise.all\(\) vs Promise.allSettled\(\)/i)).toBeInTheDocument();
  });
});
