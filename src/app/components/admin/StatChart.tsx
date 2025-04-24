"use client";

interface StatChartProps {
  title: string;
  data: {
    name: string;
    value: number;
  }[];
  type?: "bar" | "line" | "pie";
  height?: number;
}

export function StatChart({
  title,
  data,
  type = "bar",
  height = 200,
}: StatChartProps) {
  const maxValue = Math.max(...data.map((item) => item.value));
  const colors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A020F0"];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {title}
      </h3>
      <div style={{ height: `${height}px` }} className="relative">
        {type === "bar" && (
          <div className="flex items-end h-full space-x-2">
            {data.map((item, index) => (
              <div
                key={item.name}
                className="flex-1 flex flex-col items-center"
              >
                <div
                  className="w-full bg-primary-500 rounded-t"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                />
                <span className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        )}
        {type === "line" && (
          <div className="relative h-full">
            <div className="absolute bottom-0 left-0 right-0 top-0 flex items-end">
              {data.map((item, index) => (
                <div
                  key={item.name}
                  className="flex-1 flex flex-col items-center"
                  style={{
                    height: `${(item.value / maxValue) * 100}%`,
                  }}
                >
                  <div
                    className="w-1 rounded-full"
                    style={{
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {type === "pie" && (
          <div className="relative h-full flex items-center justify-center">
            <div className="relative w-40 h-40">
              {data.map((item, index) => {
                const percentage =
                  (item.value / data.reduce((sum, d) => sum + d.value, 0)) *
                  100;
                const startAngle =
                  index === 0
                    ? 0
                    : data
                        .slice(0, index)
                        .reduce(
                          (sum, d) =>
                            sum +
                            (d.value /
                              data.reduce((sum, d) => sum + d.value, 0)) *
                              360,
                          0
                        );
                return (
                  <div
                    key={item.name}
                    className="absolute inset-0"
                    style={{
                      clipPath: `polygon(50% 50%, 50% 0%, ${
                        50 + Math.cos((startAngle * Math.PI) / 180) * 50
                      }% ${
                        50 + Math.sin((startAngle * Math.PI) / 180) * 50
                      }%, ${
                        50 +
                        Math.cos(
                          ((startAngle + percentage * 3.6) * Math.PI) / 180
                        ) *
                          50
                      }% ${
                        50 +
                        Math.sin(
                          ((startAngle + percentage * 3.6) * Math.PI) / 180
                        ) *
                          50
                      }%)`,
                      backgroundColor: colors[index % colors.length],
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="text-sm text-gray-600 dark:text-gray-300">
              {item.name}: {item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
