const Container = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full mx-auto p-2 xl:px-20 max-w-[1920px]">
      {children}
    </div>
  );
};

export default Container;
