package com.klw.oa.utils.freemarker;

import freemarker.cache.TemplateLoader;
import org.springframework.web.servlet.view.freemarker.FreeMarkerConfigurer;

import java.util.List;

public class CustomFreeMarkerConfigurer extends FreeMarkerConfigurer {
    
    @Override
    protected TemplateLoader getAggregateTemplateLoader(List<TemplateLoader> templateLoaders) {

        return new HtmlTemplateLoader(super.getAggregateTemplateLoader(templateLoaders));

    }
  
}