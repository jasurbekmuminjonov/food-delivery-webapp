import Skeleton from "react-loading-skeleton";

const Loading = () => {
  return (
    <div className="loading-wrapper">
      <Skeleton borderRadius={12} height={15} />

      <Skeleton borderRadius={12} height={40} />
      <div>
        <Skeleton borderRadius={12} height={50} width={50} />
        <Skeleton borderRadius={12} height={50} width={50} />
        <Skeleton borderRadius={12} height={50} width={50} />
        <Skeleton borderRadius={12} height={50} width={50} />
      </div>
      <Skeleton borderRadius={12} height={60} />
      <Skeleton borderRadius={12} height={15} width={150} />
      <div>
        <Skeleton borderRadius={12} height={200} width={135} />
        <Skeleton borderRadius={12} height={200} width={135} />
        <Skeleton borderRadius={12} height={200} width={135} />
      </div>
      <Skeleton borderRadius={12} height={15} width={150} />
      <div>
        <Skeleton borderRadius={12} height={100} width={150} />
        <Skeleton borderRadius={12} height={100} width={150} />
        <Skeleton borderRadius={12} height={100} width={150} />
      </div>
      <Skeleton borderRadius={12} height={15} width={150} />
      <div>
        <Skeleton borderRadius={12} height={200} width={135} />
        <Skeleton borderRadius={12} height={200} width={135} />
        <Skeleton borderRadius={12} height={200} width={135} />
      </div>
    </div>
  );
};

export default Loading;
