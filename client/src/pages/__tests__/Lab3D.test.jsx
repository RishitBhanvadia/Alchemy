import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Lab3D from '../Lab3D';
import useLabStore from '../../store/labStore';

// Mock the Canvas and other heavy components
vi.mock('@react-three/fiber', () => ({
    Canvas: ({ children }) => <div data-testid="mock-canvas">{children}</div>,
}));

// Mock history and lab stores
vi.mock('../../store/historyStore', () => ({
    default: () => [],
    useHistoryStore: vi.fn(),
}));

describe('Lab3D Component', () => {
    beforeEach(() => {
        useLabStore.setState({
            chemA: 5,
            chemB: 5,
            chemI: 0,
            chemC: 0,
            reactionState: 'idle'
        });
    });

    const renderLab = () => {
        return render(
            <BrowserRouter>
                <Lab3D />
            </BrowserRouter>
        );
    };

    it('should disable play button if concentrations are below threshold of 10', () => {
        renderLab();
        const button = screen.getByTestId('initiate-reaction-btn');
        expect(button).toBeDisabled();
    });

    it('should enable play button if concentrations are at or above threshold of 10', () => {
        useLabStore.setState({
            chemA: 10,
            chemB: 10,
            chemI: 0,
            chemC: 0,
            reactionState: 'idle'
        });
        renderLab();
        const button = screen.getByTestId('initiate-reaction-btn');
        expect(button).not.toBeDisabled();
    });
});
