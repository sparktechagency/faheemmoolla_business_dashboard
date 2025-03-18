const AnalysisCard = ({ value, title, OrderDataImage }) => {
  return (
    <section className="w-full  h-auto rounded-lg bg-[#FAF9F6] border border-primary flex flex-wrap items-center justify-center p-4 md:p-6 shadow-sm">
      <div className="flex items-center gap-4 md:gap-6">
        <img
          src={OrderDataImage}
          alt="Order Data"
          className="object-contain w-14 h-14 md:w-16 md:h-16 lg:w-20 lg:h-20"
        />
        <div className="flex flex-col flex-wrap gap-2">
          <h3 className="text-xl text-wrap  md:text-2xl lg:text-3xl font-bold text-[#1E1E1E]">
            {value}
          </h3>
          <p className="text-sm md:text-base text-[#1E1E1E]">{title}</p>
        </div>
      </div>
    </section>
  );
};

export default AnalysisCard;
