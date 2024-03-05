import { FunctionComponent } from "react";
import { useGlobalStyles } from "../../globalStyles";
import { Card, Skeleton, SkeletonItem, makeStyles } from "@fluentui/react-components";

export type EventDetailsSkeletonProps = {
    hide?: ("time" | "subject" | "classroom" | "teacher" | "course")[];
    as?: "card" | "base" | undefined;
};

const useSkeletonStyles = makeStyles({
    root: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem"
    },
    body: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.2rem"
    }
});

/**
 * A skeleton component used to display a loading state of the EventDetails component.
 * @param props the properties of the component.
 */
const EventDetailsSkeleton: FunctionComponent<EventDetailsSkeletonProps> = (props: EventDetailsSkeletonProps) => {
    const styles = useSkeletonStyles();
    const globalStyles = useGlobalStyles();

    // Array of skeleton items with size 4 - props.hide.length
    const skeletonItems = Array.from({ length: 4 - (props.hide?.length || 0) }, (_, i) => (
        <SkeletonItem key={i} size={16} />
    ));

    const content = (
        <div className={styles.root}>
            <SkeletonItem size={24} />
            <div className={styles.body}>
                {skeletonItems}
            </div>
        </div>
    );

    return props.as === "card" ? (
        <Card className={globalStyles.card}>
            <Skeleton>
                {content}
            </Skeleton>
        </Card>
    ) : (
        content
    );
}

export default EventDetailsSkeleton;