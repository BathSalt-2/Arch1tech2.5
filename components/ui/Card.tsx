import React, { forwardRef } from 'react';

const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`bg-black/20 backdrop-blur-xl border border-[rgb(var(--color-border-val)/0.2)] rounded-xl shadow-2xl shadow-violet-900/10 flex flex-col ${className}`}
      {...props}
    />
  )
);
Card.displayName = 'Card';

const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`p-4 border-b border-[rgb(var(--color-border-val)/0.2)] ${className}`} {...props} />
);
CardHeader.displayName = 'CardHeader';

const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ className, ...props }) => (
  <h3 className={`text-lg font-semibold text-white ${className}`} {...props} />
);
CardTitle.displayName = 'CardTitle';

const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ className, ...props }) => (
  <p className={`text-sm text-slate-400 mt-1 ${className}`} {...props} />
);
CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={`p-4 flex-grow ${className}`} {...props} />
  )
);
CardContent.displayName = 'CardContent';

const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div className={`p-4 border-t border-[rgb(var(--color-border-val)/0.2)] ${className}`} {...props} />
);
CardFooter.displayName = 'CardFooter';

const ExportedCard = Card as typeof Card & {
  Header: typeof CardHeader;
  Title: typeof CardTitle;
  Description: typeof CardDescription;
  Content: typeof CardContent;
  Footer: typeof CardFooter;
};

ExportedCard.Header = CardHeader;
ExportedCard.Title = CardTitle;
ExportedCard.Description = CardDescription;
ExportedCard.Content = CardContent;
ExportedCard.Footer = CardFooter;

export { ExportedCard as Card };