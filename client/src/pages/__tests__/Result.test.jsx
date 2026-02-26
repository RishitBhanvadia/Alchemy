import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Result from '../result';

// Mock mocks
const mockNavigate = vi.fn();

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

// Mock external assets (correct paths relative to this test file)
vi.mock('../../assets/cloud.png', () => ({ default: 'cloud.png' }));
vi.mock('../../assets/boom.gif', () => ({ default: 'boom.gif' }));
vi.mock('../../assets/logo.png', () => ({ default: 'logo.png' }));

// Mock components that use GSAP or complex rendering
vi.mock('../../components/result_testtube', () => ({
    default: () => <div data-testid="result-testtube">Test Tube Visualization</div>
}));

vi.mock('../../components/banner', () => ({
    default: () => <div data-testid="bubble-banner">Banner</div>
}));

// Mock logger
vi.mock('../../utils/logger', () => ({
    default: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn()
    }
}));

describe('Result Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
        global.fetch = vi.fn();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('should redirect to /lab if location state is missing', () => {
        render(
            <MemoryRouter initialEntries={['/result']}>
                <Routes>
                    <Route path="/result" element={<Result />} />
                </Routes>
            </MemoryRouter>
        );

        expect(mockNavigate).toHaveBeenCalledWith('/lab');
    });

    it('should render loading state initially when state is present', async () => {
        // Mock fetch to delay response or just return promise
        global.fetch.mockImplementation(() => new Promise(() => {}));

        const state = { chemA: 50, chemB: 50, chemC: 0, chemD: 0 };

        render(
            <MemoryRouter initialEntries={[{ pathname: '/result', state }]}>
                 <Routes>
                    <Route path="/result" element={<Result />} />
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText(/analyzing reaction/i)).toBeInTheDocument();
        expect(screen.getByAltText(/loading/i)).toBeInTheDocument();
    });

    it('should render results and save to localStorage on successful fetch', async () => {
        const mockData = [{
            result: 'Reaction Successful',
            color: '#00ff00',
            solid_color: '#000000',
            gas_color: '#000000',
            gas: false,
            solid: false,
            product_name: 'Test Product',
            product_info: 'This is a test product',
            product_properties: ['Property 1', 'Property 2'],
            product_uses: ['Use 1', 'Use 2']
        }];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData
        });

        const state = { chemA: 50, chemB: 50, chemC: 0, chemD: 0 };

        render(
            <MemoryRouter initialEntries={[{ pathname: '/result', state }]}>
                 <Routes>
                    <Route path="/result" element={<Result />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for results to appear
        await waitFor(() => {
            expect(screen.getByText(/reaction complete/i)).toBeInTheDocument();
        });

        // Verify content
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText('This is a test product')).toBeInTheDocument();
        expect(screen.getByText('Reaction Successful')).toBeInTheDocument();
        expect(screen.getByTestId('result-testtube')).toBeInTheDocument();

        // Verify API call
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/result/50/50/0/0')
        );

        // Verify localStorage
        const storedCart = JSON.parse(localStorage.getItem('cart'));
        expect(storedCart).toHaveLength(1);
        expect(storedCart[0]).toMatchObject({
            conc_a: 50,
            conc_b: 50,
            conc_c: 0,
            conc_d: 0,
            main: 'Test Product'
        });
    });

    it('should handle API errors gracefully', async () => {
        // Mock fetch to reject
        global.fetch.mockRejectedValueOnce(new Error('Network Error'));

        const state = { chemA: 50, chemB: 50, chemC: 0, chemD: 0 };

        render(
            <MemoryRouter initialEntries={[{ pathname: '/result', state }]}>
                 <Routes>
                    <Route path="/result" element={<Result />} />
                </Routes>
            </MemoryRouter>
        );

        // Wait for error handling updates
        await waitFor(() => {
            // There are multiple "Error" texts, so we check specifically for the message
            const errors = screen.getAllByText(/network error/i);
            expect(errors.length).toBeGreaterThan(0);
        });
    });
});
