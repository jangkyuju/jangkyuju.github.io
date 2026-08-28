source "https://rubygems.org"

gem "jekyll-theme-chirpy", "~> 7.6"

# Security floors for transitive Jekyll dependencies.
gem "addressable", ">= 2.9.0", "< 3"
gem "concurrent-ruby", ">= 1.3.7", "< 2"
gem "json", ">= 2.19.9", "< 3"

group :jekyll_plugins do
  gem "jekyll-feed"
  gem "jekyll-sitemap"
  gem "jekyll-seo-tag"
end

# Windows and JRuby compatibility
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

gem "wdm", "~> 0.1.1", :platforms => [:mingw, :x64_mingw, :mswin]
gem "http_parser.rb", "~> 0.6.0", :platforms => [:jruby]
