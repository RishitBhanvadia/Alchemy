import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Result from '../result';
import logger from '../../utils/logger';

// Mock navigation and location
const mockNavigate = vi.fn();
const mockLocation = { state: null };

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
        useLocation: () => mockLocation,
    };
});

// Mock logger to avoid console output during tests
vi.mock('../../utils/logger', () => ({
    default: {
        warn: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
    },
}));

// Mock the TestTube component as it might involve canvas/complex SVG
vi.mock('../../components/result_testtube', () => ({
    default: () => <div data-testid="mock-testtube">TestTube</div>,
}));

// Mock Banner/Bubble
vi.mock('../../components/banner', () => ({
    default: () => <div data-testid="mock-bubble">Bubble</div>,
}));

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const mockLocalStorage = (() => {
    let store = {};
    return {
        getItem: vi.fn(key => store[key] || null),
        setItem: vi.fn((key, value) => {
            store[key] = value.toString();
        }),
        clear: vi.fn(() => {
            store = {};
        }),
    };
})();
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
});

describe('Result Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.clear();
        mockLocation.state = null;
    });

    const renderResult = () => {
        return render(
            <BrowserRouter>
                <Result />
            </BrowserRouter>
        );
    };

    it('should redirect to /lab if no location state is provided', () => {
        renderResult();
        expect(mockNavigate).toHaveBeenCalledWith('/lab');
    });

    it('should fetch data and display result when valid location state is provided', async () => {
        mockLocation.state = { chemA: 10, chemB: 20, chemC: 30, chemD: 40 };

        const mockData = [
            {
                result: 'Mocked Reaction Equation',
                color: '#ff0000',
                product_name: 'Mockonium',
                product_info: 'A very mock product',
                product_properties: ['Mocky', 'Fake'],
                product_uses: ['Testing'],
            },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        renderResult();

        // Should show loading state initially
        expect(screen.getByText(/ANALYZING REACTION\.\.\./i)).toBeInTheDocument();

        // Wait for data to load
        await waitFor(() => {
            expect(screen.getByText('REACTION COMPLETE')).toBeInTheDocument();
        });

        // Verify content is rendered
        expect(screen.getByText('Mocked Reaction Equation')).toBeInTheDocument();
        expect(screen.getByText('Mockonium')).toBeInTheDocument();
        expect(screen.getByText('A very mock product')).toBeInTheDocument();

        // Verify API call
        expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('/result/10/20/30/40'));

        // Verify localStorage update
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
            'cart',
            expect.stringContaining('"conc_a":10')
        );
    });

    it('should handle fetch error gracefully', async () => {
        mockLocation.state = { chemA: 10, chemB: 20, chemC: 30, chemD: 40 };

        global.fetch.mockRejectedValueOnce(new Error('Network error'));

        renderResult();

        await waitFor(() => {
            expect(screen.getByText(/Error: Network error/)).toBeInTheDocument();
        });

        expect(logger.error).toHaveBeenCalledWith('Fetch error:', expect.any(Error));
    });

    it('should handle empty product name', async () => {
        mockLocation.state = { chemA: 10, chemB: 20, chemC: 30, chemD: 40 };

        const mockData = [
            {
                result: 'No Reaction',
                color: '#ffffff',
                product_name: '',
                product_info: '',
                product_properties: [],
                product_uses: [],
            },
        ];

        global.fetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockData,
        });

        renderResult();

        await waitFor(() => {
            expect(screen.getByText('No Reaction / No Products')).toBeInTheDocument();
        });
    });
});
