import React from 'react';
import { cn } from '../../lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
    return (
        <div
            className={cn('bg-white rounded-lg shadow-md p-6', className)}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;

