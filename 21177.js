class MyTemplateEngine {
    constructor() {
        this.templates = {};
    }

    registerTemplate(name, content) {
        this.templates[name] = content;
    }

    render(templateName, data) {
        let template = this.templates[templateName];
        if (!template) {
            throw new Error(`Template ${templateName} not found!`);
        }

        return this.processTemplate(template, data);
    }

    processTemplate(template, data) {
        console.log(data);

        template = template.replace(/21177\{for\s+(.*?)\s+in\s+(.*?)\s*\}([\s\S]*?)\{\/for\}/gs, (_, varName, arrayName, loopContent) => {
            const array = data[arrayName.trim()];
            if (!Array.isArray(array)) return '';
        
            return array.map(item => {
                const loopData = { ...data, [varName.trim()]: item };
        
                // Process loop content and replace { item } with the actual value
                let processedLoopContent = loopContent.replace(/21177\{\s*item\s*\}/g, () => loopData['item']);
                
                return this.processTemplate(processedLoopContent, loopData);
            }).join('');
        });
        
        // Process if-else statements
        template = template.replace(/21177\{if\s+(.*?)\}(.*?)\{else\}(.*?)\{\/if\}/gs,(_, condition, truePart, falsePart) => {
            return data[condition.trim()] ? this.processTemplate(truePart, data) : this.processTemplate(falsePart, data);
        });
        // Process variable replacements
        template = template.replace(/21177\{([^{}]+)\}/g, (_, varName) => {
            return data[varName.trim()] || '';
        });


        // Process for loops
       
        return template;
    }
}

module.exports = MyTemplateEngine;
