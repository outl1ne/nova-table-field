const mix = require('laravel-mix')
const path = require('path')

class NovaExtension {
    name() {
        return 'nova-extension'
    }

    register(name) {
        this.name = name
    }

    webpackConfig(webpackConfig) {
        webpackConfig.externals = {
            vue: 'Vue',
            'laravel-nova': 'LaravelNova'
        }

        webpackConfig.output = {
            uniqueName: this.name,
        }
    }
}

mix.extend('nova', new NovaExtension())
