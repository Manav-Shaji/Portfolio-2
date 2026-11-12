import React from 'react';
import { render, screen } from '@testing-library/react';
import HomePage from './page';

describe('HomePage', () => {
  it('renders the portfolio hero and primary sections', () => {
    render(React.createElement(HomePage));

    expect(screen.getAllByText(/manav shaji/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /work/i })).toBeInTheDocument();
    expect(screen.getAllByText(/selected work/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/contact/i).length).toBeGreaterThan(0);
  });
});
