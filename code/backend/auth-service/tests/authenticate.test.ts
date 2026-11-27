import { describe, it, expect, vi, beforeAll } from 'vitest';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate } from '../src/middleware/authenticate.js';

const SECRET = 'test-secret';

// Minimal fake request/response so the middleware can be tested without a server
function fakeRequest(authorization?: string) {
  return { headers: { authorization } } as unknown as Request;
}

function fakeResponse() {
  const res = { status: vi.fn(), json: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}

describe('authenticate middleware', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = SECRET;
  });

  it('returns 401 when there is no Authorization header', () => {
    const res = fakeResponse();
    const next = vi.fn();

    authenticate(fakeRequest(), res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 when the token is invalid', () => {
    const res = fakeResponse();
    const next = vi.fn();

    authenticate(fakeRequest('Bearer not-a-real-token'), res as unknown as Response, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it('calls next() and sets req.user when the token is valid', () => {
    const token = jwt.sign({ sub: 1, email: 'student@example.com', role: 'USER' }, SECRET);
    const req = fakeRequest(`Bearer ${token}`);
    const res = fakeResponse();
    const next = vi.fn();

    authenticate(req, res as unknown as Response, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.user?.email).toBe('student@example.com');
  });
});
