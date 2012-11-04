describe('ngx.dictionary', function() {
    var items = {
        en: {
            dictionary: 'dictionary',
            item: 'item',
            test: 'should register items'
        },
        cz: {
            dictionary: 'slovník',
            item: 'položka',
            test: 'měl by zaregistrovat položky'
        }
    };

    beforeEach(function() {
        module('ngx.dictionary');

        // change default angular english $locale to czech
        inject(function($locale) {
            $locale.id = 'cz-cs';
        });

        inject(function(ngxDictionary) {
            ngxDictionary.addItems('en', items.en);
            ngxDictionary.addItems('cz', items.cz);
        });
    });

    it('should return item by default $locale language', inject(function(ngxDictionary) {
        expect(ngxDictionary('test')).toEqual(items.cz.test);
        expect(ngxDictionary('item')).toEqual(items.cz.item);
        expect(ngxDictionary('dictionary')).toEqual(items.cz.dictionary);
    }));

    it('should return item by specified/set language', inject(function(ngxDictionary) {
        expect(ngxDictionary('test')).toEqual(items.cz.test);
        expect(ngxDictionary('dictionary', 'en')).toEqual(items.en.dictionary);

        // change default language
        ngxDictionary.setLanguage('en');
        expect(ngxDictionary('item')).toEqual(items.en.item);
        expect(ngxDictionary('test', 'cz')).toEqual(items.cz.test);
        expect(ngxDictionary('test', 'en')).toEqual(items.en.test);
    }));

});