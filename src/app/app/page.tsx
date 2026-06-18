import { ScreenHeader } from "@/components/app-shell/screen-header";
import { PostCard } from "@/components/feed/post-card";
import { Card, CardContent } from "@/components/ui/card";
import { getFeed } from "@/lib/data/feed";

// Always reflect the latest approved posts.
export const dynamic = "force-dynamic";

export default async function FeedScreen() {
  const posts = await getFeed();

  return (
    <div>
      <ScreenHeader title="Discover" subtitle="Real Dubai interiors, anonymously" />

      <div className="flex flex-col gap-5 px-4 pt-2">
        {posts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center">
              <p className="font-semibold">No projects yet</p>
              <p className="text-sm text-muted-foreground">
                Once the database is seeded, real projects appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          posts.map((post, i) => (
            <div
              key={post.id}
              className="animate-fade-up"
              style={{ animationDelay: `${Math.min(i, 6) * 60}ms`, opacity: 0 }}
            >
              <PostCard post={post} priority={i < 2} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
