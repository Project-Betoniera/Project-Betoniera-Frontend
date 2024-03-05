import { Card, Skeleton, SkeletonItem, makeStyles } from "@fluentui/react-components";
import { FunctionComponent } from "react";
import { useGlobalStyles } from "../../globalStyles";

const useStyles = makeStyles({
    skeletonRoot: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.5rem"
    },
    skeletonBody: {
        display: "flex",
        flexDirection: "column",
        rowGap: "0.2rem"
    }
})

const ClassroomDetailsSkeleton: FunctionComponent = () => {
    const styles = useStyles();
    const globalStyles = useGlobalStyles();

    return (
        <Card className={globalStyles.card}>
            <Skeleton>
                <div className={styles.skeletonRoot}>
                    <SkeletonItem size={24} />
                    <div className={styles.skeletonBody}>
                        <SkeletonItem size={16} />
                    </div>
                </div>
            </Skeleton>
        </Card>
    );
}

export default ClassroomDetailsSkeleton;