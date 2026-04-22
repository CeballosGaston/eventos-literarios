import { describe, it, expect, vi, beforeEach } from 'vitest';
import { signUp, signIn, signOut } from './authService';
import { supabase } from '@/shared/lib/supabaseClient';
import type { User, AuthError, Session } from '@supabase/supabase-js';

// Feature: Authentication Service
//   As a developer
//   I want to handle user authentication (sign up, sign in, sign out)
//   So that I can manage user access to the platform



// Mock 
vi.mock('@/shared/lib/supabaseClient', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
  },
}));

describe('Auth Service Unit Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /**
   * Scenario: Successful Sign Up
   * Given a valid email and password
   * When the user attempts to sign up
   * Then Supabase should create the user and return the user data
   */
  it('should sign up a user successfully', async () => {
    const mockUser = { id: '123', email: 'test@example.com' } as User;
    
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: mockUser, session: null },
      error: null,
    });

    const result = await signUp('test@example.com', 'password123');

    expect(supabase.auth.signUp).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.user).toEqual(mockUser);
  });

  /**
   * Scenario: Successful Sign In
   * Given registered credentials
   * When the user attempts to sign in
   * Then it should return the session data
   */
  it('should sign in successfully', async () => {
    const mockUser = { id: '123' } as User;
    const mockSession = { access_token: 'abc-123' } as Session; 
    vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
      data: { user: mockUser, session: mockSession },
      error: null,
    });

    const result = await signIn('test@example.com', 'password123');

    expect(supabase.auth.signInWithPassword).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(result.session).toEqual(mockSession);
  });

  /**
   * Scenario: Failed Sign Up (Error handling)
   * When Supabase returns an error
   * Then the service should throw that error
   */
  it('should throw an error when sign up fails', async () => {
   
    const mockError: Partial<AuthError> = { message: 'User already registered', status: 400 };
    
    vi.mocked(supabase.auth.signUp).mockResolvedValue({
      data: { user: null, session: null },
      error: mockError as AuthError, 
    });

    await expect(signUp('test@example.com', 'password123'))
      .rejects.toThrow('User already registered');
  });

  /**
   * Scenario: Successful Sign Out
   */
  it('should call supabase signOut method', async () => {
    vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

    await signOut();

    expect(supabase.auth.signOut).toHaveBeenCalledTimes(1);
  });
});