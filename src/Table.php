<?php

namespace Outl1ne\NovaTableField;

use Laravel\Nova\Fields\Field;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Http\Requests\NovaRequest;

class Table extends Field
{
    /**
     * The field's component.
     *
     * @var string
     */
    public $component = 'nova-table-field';

    /**
     * Indicates if the element should be shown on the index view.
     *
     * @var bool
     */
    public $showOnIndex = false;

    /**
     * Determine if new rows are able to be added.
     *
     * @var bool
     */
    public $canAdd = true;

    /**
     * Determine if rows are able to be deleted.
     *
     * @var bool
     */
    public $canDelete = true;

    /**
     * The minimum number of rows in the table.
     *
     * @param  mixed  $min
     * @return $this
     */
    public function minRows($min): static
    {
        return $this->withMeta(['minRows' => $min]);
    }

    /**
     * The maximum number of rows in the table.
     *
     * @param  mixed  $max
     * @return $this
     */
    public function maxRows($max): static
    {
        return $this->withMeta(['maxRows' => $max]);
    }

    /**
     * The minimum number of columns in the table.
     *
     * @param  mixed  $min
     * @return $this
     */
    public function minColumns($min): static
    {
        return $this->withMeta(['minColumns' => $min]);
    }

    /**
     * The maximum number of columns in the table.
     *
     * @param  mixed  $max
     * @return $this
     */
    public function maxColumns($max): static
    {
        return $this->withMeta(['maxColumns' => $max]);
    }

    /**
     * Disable adding new rows and columns.
     *
     * @return $this
     */
    public function disableAdding(): static
    {
        $this->canAdd = false;

        return $this;
    }

    /**
     * Disable deleting rows and columns.
     *
     * @return $this
     */
    public function disableDeleting(): static
    {
        $this->canDelete = false;

        return $this;
    }

    /**
     * Set the default values for the table.
     *
     * @param array $values
     * @return $this
     */
    public function defaultValues($values): self
    {
        return $this->withMeta(['defaultValues' => $values]);
    }

    /**
     * Prepare the field element for JSON serialization.
     *
     * @return array
     */
    public function jsonSerialize(): array
    {
        return array_merge(parent::jsonSerialize(), [
            'canAdd' => $this->canAdd,
            'canDelete' => $this->canDelete,
        ]);
    }

    /**
     * Hydrate the given attribute on the model based on the incoming request.
     *
     * @param  NovaRequest  $request
     * @param  string  $requestAttribute
     * @param  object  $model
     * @param  string  $attribute
     * @return void
     */
    protected function fillAttributeFromRequest(NovaRequest $request, $requestAttribute, $model, $attribute): void
    {
        if ($request->exists($requestAttribute)) {
            $model->{$attribute} = json_decode($request[$requestAttribute], true);
        }
    }
}
