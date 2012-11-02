describe('ngx.loader', function() {
    beforeEach(function() {
        module('ngx.loader');
    });

    it('should not load same files twice', inject(function(ngxLoader) {
        ngxLoader(['test1.js', 'test2.js', 'test1.js'], waitsFor(function() {
            expect(ngxLoader.getLoaded().length).toEqual(2);
            return true;
        }));
    }));

    it('should throw an exception on unsupported type', inject(function(ngxLoader) {
        expect(function() {
            ngxLoader('image.jpg');
        }).toThrow('File type not supported');
    }));

});