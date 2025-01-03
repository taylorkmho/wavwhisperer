import { decode } from "html-entities";
import { useNoaaSurfReport } from "@/hooks/useNoaaSurfReport";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SurfReport({ island = "oahu" }: { island?: string }) {
  const { data: report, isLoading, error } = useNoaaSurfReport(island);

  if (isLoading) {
    return <div>Loading surf report...</div>;
  }

  if (error) {
    return <div>Error loading surf report</div>;
  }

  if (!report) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Last Updated */}
      <div className="text-sm text-muted-foreground">
        Last updated: {new Date(report.lastBuildDate).toLocaleString()}
      </div>

      {/* Discussion */}
      {report.discussion && report.discussion.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <h3 className="mb-4 text-lg font-semibold">Discussion</h3>
            <div className="space-y-4 text-sm">
              {report.discussion.map((paragraph, index) => (
                <p key={index}>{decode(paragraph)}</p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Wave Heights */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Wave Heights</h3>
          <div className="grid gap-4 md:grid-cols-2">
            {report.waveHeights.map((wave, index) => (
              <div
                key={index}
                className="rounded-lg border bg-card p-4 text-card-foreground"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{wave.direction}</span>
                  <span className="text-sm text-muted-foreground">
                    {wave.day} {wave.time}
                  </span>
                </div>
                <div className="mt-2 text-2xl font-bold">{wave.height} ft</div>
                <div className="mt-1 text-sm text-muted-foreground">
                  Average: {wave.averageHeight.toFixed(1)} ft
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* General Day Info */}
      <Card>
        <CardContent className="pt-6">
          <h3 className="mb-4 text-lg font-semibold">Conditions</h3>
          <div className="space-y-4">
            {report.generalDayInfo.map((info, index) => (
              <div key={index}>
                {index > 0 && <Separator className="my-4" />}
                <h4 className="mb-2 font-medium">{info.day}</h4>
                <dl className="grid gap-2 text-sm">
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Weather</dt>
                    <dd>{info.weather}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Temperature</dt>
                    <dd>{info.temperature}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Winds</dt>
                    <dd>{info.winds}</dd>
                  </div>
                  <div className="grid grid-cols-2">
                    <dt className="text-muted-foreground">Sunrise/Sunset</dt>
                    <dd>
                      {info.sunrise} / {info.sunset}
                    </dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
