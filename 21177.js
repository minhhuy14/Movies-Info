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

        // Process for loops
        template = template.replace(/21177\{for\s+(.*?)\s+in\s+(.*?)\}([\s\S]*?)\{\/for\}/g, (_, varName, arrayName, loopContent) => {
            const array = data[arrayName.trim()];
            if (!Array.isArray(array)) return '';

            let result = '';
            for (const item of array) {
                const loopData = { ...data, [varName.trim()]: item };
                result += this.processTemplate(loopContent, loopData);
            }
            return result;
        });
        
        // Process if-else statements
        template = template.replace(/21177\{if\s+(.*?)\}(.*?)\{else\}(.*?)\{\/if\}/gs,(_, condition, truePart, falsePart) => {
            return data[condition.trim()] ? this.processTemplate(truePart, data) : this.processTemplate(falsePart, data);
        });

        // Process variable replacements
        template = template.replace(/21177\{([^{}]+)\}/g, (_, varName) => {
            let value = data;
            const properties = varName.trim().split('.');
            for (const prop of properties) {
                value = value[prop];
                if (value === undefined) return '';
            }
            return value || '';
        });

        return template;
    }
}
module.exports = MyTemplateEngine;
