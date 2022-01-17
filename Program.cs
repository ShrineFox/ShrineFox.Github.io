using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTMLGen
{
    internal class Program
    {
        public static string baseURL;
        public static string workingDirectory = Path.GetFullPath(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..\\..\\"));

        static void Main(string[] args)
        {
            // Set URL depending on whether debug or production
            #if DEBUG
                baseURL = workingDirectory;
            #elif !DEBUG
                baseURL = "./";
            #endif

            // List page titles, content, and destination filepaths
            List<Page> pages = new List<Page>()
            {
                new Page() { Title = "Index", Content = Resources.index, OutputPath = "./index.html" }
            };

            // Recreate .HTML file at each page's path
            foreach (var page in pages)
            {
                Console.WriteLine($"Creating {page.OutputPath}");
                StringBuilder sb = new StringBuilder();
                // Replace ASP.NET markup with standard HTML
                sb.Append(Resources.head.Replace("@ViewData[\"Title\"]", page.Title)
                    .Replace("~/", baseURL) + Environment.NewLine);
                sb.Append(Resources.body.Replace("asp-page=\"/", $"href=\"{baseURL}")
                    .Replace("~/", baseURL) + Environment.NewLine);
                sb.Append(page.Content.Replace("asp-page=\"/", $"href=\"\\{baseURL}")
                    .Replace("~/", baseURL) + Environment.NewLine);
                sb.Append(Resources.footer.Replace("asp-page=\"/", $"href=\"\\{baseURL}")
                    .Replace("~/", baseURL).Replace("@await RenderSectionAsync(\"Scripts\", required: false)", ""));
                // Overwrite or Create .HTML File
                File.WriteAllText(Path.Combine(workingDirectory, page.OutputPath), sb.ToString());
            }
            Console.WriteLine($"Done!");
        }

        public class Page
        {
            public string Title { get; set; } = "";
            public string Content { get; set; } = "";
            public string OutputPath { get; set; } = "";
        }
    }
}
