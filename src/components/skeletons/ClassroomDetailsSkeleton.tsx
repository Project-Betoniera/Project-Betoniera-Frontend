import { Card, Skeleton, SkeletonItem, makeStyles } from "@fluentui/react-components";
import { FunctionComponent } from "react";
import { useGlobalStyles } from "../../globalStyles";

type ClassroomDetailsSkeletonProps = {
  lines?: number;
};

const useStyles = makeStyles({
  skeletonRoot: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.8rem",
  },
  skeletonBody: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.5rem",
  },
});

const ClassroomDetailsSkeleton: FunctionComponent<ClassroomDetailsSkeletonProps> = (props) => {
  const styles = useStyles();
  const globalStyles = useGlobalStyles();

  return (
    <Card className={globalStyles.card}>
      <Skeleton>
        <div className={styles.skeletonRoot}>
          <SkeletonItem size={24} />
          <div className={styles.skeletonBody}>
            {new Array(props.lines || 1).fill(null).map((_, index) => (
              <SkeletonItem key={index} size={16} />
            ))}
          </div>
        </div>
      </Skeleton>
    </Card>
  );
};

export default ClassroomDetailsSkeleton;
