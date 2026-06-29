export const contentWidthClass = "mx-[18.75%]";

type ContentContainerProps = {
  children: React.ReactNode;
};

export function ContentContainer({ children }: ContentContainerProps) {
  return (
    <div className={`relative z-10 ${contentWidthClass} min-h-[calc(100vh-4.5rem)]`}>
      {children}
    </div>
  );
}
