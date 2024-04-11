import { FunctionComponent } from "react";
import { useGlobalStyles } from "../../globalStyles";
import { Card, Skeleton, SkeletonItem, makeStyles } from "@fluentui/react-components";

export type EventDetailsSkeletonProps = {
  lines?: number;
  as?: "card";
};

const useSkeletonStyles = makeStyles({
  root: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.8rem",
  },
  body: {
    display: "flex",
    flexDirection: "column",
    rowGap: "0.5rem",
  },
});

/**
 * A skeleton component used to display a loading state of the EventDetails component.
 * @param props the properties of the component.
 */
const EventDetailsSkeleton: FunctionComponent<EventDetailsSkeletonProps> = (props: EventDetailsSkeletonProps) => {
  const styles = useSkeletonStyles();
  const globalStyles = useGlobalStyles();

  const content = (
    <div className={styles.root}>
      <SkeletonItem size={24} />
      <div className={styles.body}>
        {new Array(props.lines || 1).fill(null).map((_, index) => (
          <SkeletonItem key={index} size={16} />
        ))}
      </div>
    </div>
  );

  return props.as === "card" ?
      <Card className={globalStyles.card}>
        <Skeleton>{content}</Skeleton>
      </Card>
    : content;
};

export default EventDetailsSkeleton;
