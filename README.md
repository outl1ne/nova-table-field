# Nova Table Field

[![Latest Version on Packagist](https://img.shields.io/packagist/v/optimistdigital/nova-table-field.svg?style=flat-square)](https://packagist.org/packages/optimistdigital/nova-table-field)
[![Total Downloads](https://img.shields.io/packagist/dt/optimistdigital/nova-table-field.svg?style=flat-square)](https://packagist.org/packages/optimistdigital/nova-table-field)

Simple [Laravel Nova](https://nova.laravel.com) Table field.


### Form View

![Form View GIF](docs/form.gif)


## Installation

Install the package in a Laravel Nova project via Composer:

```bash
composer require optimistdigital/nova-table-field
```

## Usage

The `Table` field provides a convenient interface to edit rows and columns stored inside `JSON` equivalent column.
```php
use OptimistDigital\NovaTableField\Table;

public function fields(Request $request)
{
    return [
        Table::make('Countries')

        // Optional:
        ->disableAdding() // Disable adding new rows and columns
        ->disableDeleting() // Disable deleting rows and columns
        ->minRows(1) // The minimum number of rows in the table
        ->maxRows(10) // The maximum number of rows in the table
        ->minColumns(1) // The minimum number of columns in the table
        ->maxColumns(10) // The maximum number of columns in the table
    ];
}
```

## Localization

The translations file can be published by using the following publish command:

```bash
php artisan vendor:publish --provider="OptimistDigital\NovaTableField\FieldServiceProvider" --tag="translations"
```

You can then edit the strings to your liking.
