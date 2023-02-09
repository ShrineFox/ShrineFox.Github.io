using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HTMLGen
{
    public class Page 
    {
        public Page(string url, string pageName, string content, string noticeColor = "", string noticeMsg = "")
        {
            this.Url = url;
            this.PageName = pageName;
            this.Content = content;
            this.NoticeColor = noticeColor;
            this.NoticeMsg = noticeMsg;
        }
        public string Url { get; set; } = "";
        public string Content { get; set; } = "";
        public string PageName { get; set; } = "";
        public string NoticeColor { get; set; } = "";
        public string NoticeMsg { get; set; } = "";
        internal static void Write(Page page)
        {
            string outPath = Path.Combine(Program.root, page.Url);
            string html = Program.head.Replace("./resources/", $"{Program.MakeRelativePath(Program.root, page.Url).Replace(page.Url, "./")}resources/")
                + Program.body 
                + page.Content.Replace("<div class=\"notice\"></div>", $"<div class=\"notice {page.NoticeColor}\">{page.NoticeMsg}</div>")
                + Program.footer;
            File.WriteAllText(outPath, html);
        }
    }

    public class Program
    {
        public static string root = Path.GetDirectoryName(Path.GetDirectoryName(Environment.CurrentDirectory));
        public static string head = File.ReadAllText(Path.Combine(root, "resources/html/head.html"));
        public static string body = File.ReadAllText(Path.Combine(root, "resources/html/body.html"));
        public static string footer = File.ReadAllText(Path.Combine(root, "resources/html/footer.html"));

        static void Main(string[] args)
        {
            // Create collection of pages
            List<Page> pages = new List<Page>();
            // Add homepage
            pages.Add(new Page("index.html", "ShrineFox Home Page", File.ReadAllText(Path.Combine(root, "resources/html/pages/default.html"))));

            foreach (var page in pages)
            {
                // Add notice to page
                page.NoticeColor = "yellow";
                page.NoticeMsg = "<b>Notice:</b> This is a static version of <a href=\"https://shrinefox.com/\">ShrineFox.com</a>. " +
                    $"As such, some features from the live site are not available, including:" +
                    $"<br><b>TextSearch</b>, <b>Patch.yml/.pnach/PKG Generation</b>, <b>Forum</b>, <b>Search</b>." +
                    $"<br>Alternative sources are linked above.";
                
                // Generate page .html
                Console.WriteLine($"Writing page: {page.Url}");
                Page.Write(page);
            }
            Console.WriteLine("\nDone!");
            Console.ReadKey();
        }

        // https://stackoverflow.com/a/19453551
        public static string MakeRelativePath(string workingDirectory, string fullPath)
        {
            string result = string.Empty;
            int offset;

            // this is the easy case.  The file is inside of the working directory.
            if (fullPath.StartsWith(workingDirectory))
            {
                return fullPath.Substring(workingDirectory.Length + 1);
            }

            // the hard case has to back out of the working directory
            string[] baseDirs = workingDirectory.Split(new char[] { ':', '\\', '/' });
            string[] fileDirs = fullPath.Split(new char[] { ':', '\\', '/' });

            // if we failed to split (empty strings?) or the drive letter does not match
            if (baseDirs.Length <= 0 || fileDirs.Length <= 0 || baseDirs[0] != fileDirs[0])
            {
                // can't create a relative path between separate harddrives/partitions.
                return fullPath;
            }

            // skip all leading directories that match
            for (offset = 1; offset < baseDirs.Length; offset++)
            {
                if (baseDirs[offset] != fileDirs[offset])
                    break;
            }

            // back out of the working directory
            for (int i = 0; i < (baseDirs.Length - offset); i++)
            {
                result += "..\\";
            }

            // step into the file path
            for (int i = offset; i < fileDirs.Length - 1; i++)
            {
                result += fileDirs[i] + "\\";
            }

            // append the file
            result += fileDirs[fileDirs.Length - 1];

            return result;
        }
    }
}
