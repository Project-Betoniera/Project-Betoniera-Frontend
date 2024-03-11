import axios from "axios";
import { GithubContributor } from "../../routes/About";

export default function githubRequests() {
    function parseGithubContributors(data: any) {
        const result: GithubContributor[] = [];
        if (!Array.isArray(data)) return result;

        data.forEach((contributor: any) => {
            const user: GithubContributor = {
                id: contributor.id,
                login: contributor.login,
                avatar_url: contributor.avatar_url,
                html_url: contributor.html_url,
                contributions: contributor.contributions,
            };

            result.push(user);
        });

        return result;
    }

    return {
        contributors: async (): Promise<GithubContributor[]> => {
            return await axios({
                method: "GET",
                url: new URL(
                    "https://api.github.com/repos/Project-Betoniera/Project-Betoniera-Frontend/contributors"
                ).toString(),
                headers: {
                    // TODO Revert commit that implements __REPO_METADATA_API_KEY__ once the project is public
                    Authorization: __REPO_METADATA_API_KEY__,
                },
            }).then((response) => {
                return parseGithubContributors(response.data);
            }).catch(() => {
                return [] as GithubContributor[];
            });
        }
    };
}